import { prisma } from '@/lib/prisma';
import { CareerEventType } from '@prisma/client';

export interface Phase1PromotionCriteria {
  minPerformanceScore: number;
  minTenureGameDays: number;
}

export interface PromotionEligibility {
  isEligible: boolean;
  currentLevel: number;
  nextLevel: number | null;
  nextRoleTitle: string | null;
  requirements: {
    performanceScore: { current: number; required: number; met: boolean };
    tenureGameDays: { current: number; required: number; met: boolean };
  };
  summary: string;
}

const DEFAULT_PHASE1_THRESHOLDS: Record<number, Phase1PromotionCriteria> = {
  2: { minPerformanceScore: 70, minTenureGameDays: 7 },
  3: { minPerformanceScore: 75, minTenureGameDays: 14 },
  4: { minPerformanceScore: 80, minTenureGameDays: 28 },
  5: { minPerformanceScore: 85, minTenureGameDays: 45 }
};

function parseCriteria(raw: unknown, nextLevel: number): Phase1PromotionCriteria {
  const fallback = DEFAULT_PHASE1_THRESHOLDS[nextLevel] ?? {
    minPerformanceScore: 80,
    minTenureGameDays: 14
  };
  if (!raw || typeof raw !== 'object') return fallback;
  const obj = raw as Record<string, unknown>;
  return {
    minPerformanceScore:
      typeof obj.minPerformanceScore === 'number' ? obj.minPerformanceScore : fallback.minPerformanceScore,
    minTenureGameDays:
      typeof obj.minTenureGameDays === 'number' ? obj.minTenureGameDays : fallback.minTenureGameDays
  };
}

/**
 * Phase 1 Career Service
 * Aligned strictly with Phase 1 foundational models:
 * Employee, OrganisationUnit, CareerTrack, JobRole, SalaryBand, CareerHistory.
 *
 * Note: Brief-completion counts and HR commendation records will be layered in during Phase 2.
 */
export class CareerService {
  /**
   * Fetch an employee's current career overview including role, track, unit, salary band, and history.
   */
  public static async getEmployeeCareerOverview(employeeId: string) {
    return await prisma.employee.findUnique({
      where: { id: employeeId },
      include: {
        organisationUnit: true,
        jobRole: {
          include: {
            careerTrack: true,
            salaryBand: true
          }
        },
        careerHistories: {
          orderBy: { effectiveAt: 'desc' }
        }
      }
    });
  }

  /**
   * Evaluate Phase 1 promotion eligibility using performance score and in-game tenure days.
   */
  public static async evaluatePromotionEligibility(
    employeeId: string,
    currentGameDay: number
  ): Promise<PromotionEligibility> {
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      include: {
        organisationUnit: true,
        jobRole: {
          include: {
            careerTrack: true,
            salaryBand: true
          }
        }
      }
    });

    if (!employee) {
      throw new Error(`Employee not found: ${employeeId}`);
    }

    const currentLevel = employee.jobRole.level;
    const nextRole = await prisma.jobRole.findUnique({
      where: {
        careerTrackId_level: {
          careerTrackId: employee.careerTrackId,
          level: currentLevel + 1
        }
      },
      include: { salaryBand: true }
    });

    if (!nextRole) {
      return {
        isEligible: false,
        currentLevel,
        nextLevel: null,
        nextRoleTitle: null,
        requirements: {
          performanceScore: { current: Math.round(employee.performanceScore), required: 0, met: true },
          tenureGameDays: { current: Math.max(0, currentGameDay - employee.hiredGameDay), required: 0, met: true }
        },
        summary: 'Maximum career level achieved in this track.'
      };
    }

    const criteria = parseCriteria(employee.jobRole.promotionCriteria, nextRole.level);
    const currentPerformance = Math.round(employee.performanceScore);
    const currentTenureGameDays = Math.max(0, currentGameDay - employee.hiredGameDay);

    const perfMet = currentPerformance >= criteria.minPerformanceScore;
    const tenureMet = currentTenureGameDays >= criteria.minTenureGameDays;
    const isEligible = perfMet && tenureMet;

    return {
      isEligible,
      currentLevel,
      nextLevel: nextRole.level,
      nextRoleTitle: nextRole.title,
      requirements: {
        performanceScore: {
          current: currentPerformance,
          required: criteria.minPerformanceScore,
          met: perfMet
        },
        tenureGameDays: {
          current: currentTenureGameDays,
          required: criteria.minTenureGameDays,
          met: tenureMet
        }
      },
      summary: isEligible
        ? `Ready for promotion to ${nextRole.title}!`
        : `Requirements not met for promotion to ${nextRole.title}.`
    };
  }

  /**
   * Execute an authoritative Phase 1 promotion transaction.
   * Clamps negotiatedSalary strictly within the target role's fictional game salary band
   * and records an immutable CareerHistory snapshot.
   */
  public static async executePromotion(
    employeeId: string,
    currentGameDay: number,
    negotiatedSalary?: number
  ) {
    const eligibility = await this.evaluatePromotionEligibility(employeeId, currentGameDay);
    if (!eligibility.isEligible || !eligibility.nextLevel) {
      throw new Error(`Employee is not eligible for promotion: ${eligibility.summary}`);
    }

    return await prisma.$transaction(async (tx) => {
      const employee = await tx.employee.findUnique({
        where: { id: employeeId },
        include: {
          organisationUnit: true,
          jobRole: true
        }
      });

      if (!employee) {
        throw new Error('Employee not found');
      }

      const nextRole = await tx.jobRole.findUnique({
        where: {
          careerTrackId_level: {
            careerTrackId: employee.careerTrackId,
            level: eligibility.nextLevel!
          }
        },
        include: { salaryBand: true }
      });

      if (!nextRole) {
        throw new Error(`Target role for level ${eligibility.nextLevel} not found in track.`);
      }

      // Server-authoritative salary band clamping (Whole Naira INTEGER)
      const requested = negotiatedSalary ?? nextRole.salaryBand.minSalary;
      const approvedSalary = Math.min(
        nextRole.salaryBand.maxSalary,
        Math.max(nextRole.salaryBand.minSalary, Math.round(requested))
      );

      // 1. Update employee to next role in the same career track (respecting composite FK)
      const updatedEmployee = await tx.employee.update({
        where: { id: employee.id },
        data: {
          jobRoleId: nextRole.id,
          currentSalary: approvedSalary
        },
        include: {
          organisationUnit: true,
          jobRole: {
            include: {
              careerTrack: true,
              salaryBand: true
            }
          }
        }
      });

      // 2. Append immutable CareerHistory snapshot
      await tx.careerHistory.create({
        data: {
          employeeId: employee.id,
          eventType: CareerEventType.PROMOTED,
          roleTitleSnapshot: nextRole.title,
          levelSnapshot: nextRole.level,
          unitNameSnapshot: employee.organisationUnit.name,
          salarySnapshot: approvedSalary,
          effectiveGameDay: currentGameDay,
          notes: `Promoted from ${employee.jobRole.title} to ${nextRole.title}.`
        }
      });

      return {
        success: true,
        promotedRole: nextRole.title,
        newSalary: approvedSalary,
        employee: updatedEmployee
      };
    });
  }
}
