import { prisma } from '@/lib/prisma';
import { HRActionType, AssignmentStatus } from '@prisma/client';

export interface PromotionEligibility {
  isEligible: boolean;
  currentLevel: number;
  nextLevel: number | null;
  nextRoleTitle: string | null;
  requirements: {
    briefsCompleted: { current: number; required: number; met: boolean };
    averageScore: { current: number; required: number; met: boolean };
    performanceScore: { current: number; required: number; met: boolean };
    tenureDays: { current: number; required: number; met: boolean };
  };
  summary: string;
}

export const PROMOTION_THRESHOLDS: Record<number, {
  briefsRequired: number;
  minAverageScore: number;
  minPerformanceScore: number;
  minTenureDays: number;
}> = {
  2: { briefsRequired: 3, minAverageScore: 70, minPerformanceScore: 70, minTenureDays: 7 },
  3: { briefsRequired: 6, minAverageScore: 75, minPerformanceScore: 75, minTenureDays: 14 },
  4: { briefsRequired: 10, minAverageScore: 80, minPerformanceScore: 80, minTenureDays: 28 },
  5: { briefsRequired: 15, minAverageScore: 85, minPerformanceScore: 85, minTenureDays: 45 }
};

export class CareerService {
  /**
   * Evaluate whether an employee satisfies all authoritative criteria for promotion.
   */
  public static async evaluatePromotionEligibility(employeeId: string): Promise<PromotionEligibility> {
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      include: {
        department: true,
        jobRole: true,
        briefAssignments: {
          include: {
            submission: {
              include: { evaluation: true }
            }
          }
        }
      }
    });

    if (!employee) {
      throw new Error(`Employee not found: ${employeeId}`);
    }

    const currentLevel = employee.jobRole.level;
    const nextLevel = currentLevel < 5 ? currentLevel + 1 : null;

    if (!nextLevel) {
      return {
        isEligible: false,
        currentLevel,
        nextLevel: null,
        nextRoleTitle: null,
        requirements: {
          briefsCompleted: { current: 0, required: 0, met: true },
          averageScore: { current: 0, required: 0, met: true },
          performanceScore: { current: 0, required: 0, met: true },
          tenureDays: { current: 0, required: 0, met: true }
        },
        summary: 'Maximum career level (Director / Head of Department) achieved.'
      };
    }

    // Find next job role in the same track
    const nextRole = await prisma.jobRole.findFirst({
      where: {
        track: employee.jobRole.track,
        level: nextLevel
      }
    });

    const threshold = PROMOTION_THRESHOLDS[nextLevel];

    // Compute player performance stats
    const completedAssignments = employee.briefAssignments.filter(
      (a) => a.status === AssignmentStatus.SUBMITTED && a.submission?.evaluation
    );
    const briefsCompletedCount = completedAssignments.length;

    const totalScore = completedAssignments.reduce(
      (acc, a) => acc + (a.submission?.evaluation?.score || 0),
      0
    );
    const averageScore = briefsCompletedCount > 0 ? Math.round(totalScore / briefsCompletedCount) : 0;
    const currentPerformance = Math.round(employee.performanceScore);

    // Calculate tenure in days
    const tenureMillis = Date.now() - new Date(employee.hiredAt).getTime();
    const currentTenureDays = Math.floor(tenureMillis / (1000 * 60 * 60 * 24));

    const briefsMet = briefsCompletedCount >= threshold.briefsRequired;
    const scoreMet = averageScore >= threshold.minAverageScore;
    const perfMet = currentPerformance >= threshold.minPerformanceScore;
    const tenureMet = currentTenureDays >= threshold.minTenureDays;

    const isEligible = briefsMet && scoreMet && perfMet && tenureMet;

    return {
      isEligible,
      currentLevel,
      nextLevel,
      nextRoleTitle: nextRole?.title || `Level ${nextLevel} Role`,
      requirements: {
        briefsCompleted: { current: briefsCompletedCount, required: threshold.briefsRequired, met: briefsMet },
        averageScore: { current: averageScore, required: threshold.minAverageScore, met: scoreMet },
        performanceScore: { current: currentPerformance, required: threshold.minPerformanceScore, met: perfMet },
        tenureDays: { current: currentTenureDays, required: threshold.minTenureDays, met: tenureMet }
      },
      summary: isEligible
        ? `Ready for promotion to ${nextRole?.title}!`
        : `Requirements not met for promotion to Level ${nextLevel}.`
    };
  }

  /**
   * Execute an authoritative promotion transaction.
   */
  public static async executePromotion(employeeId: string) {
    const eligibility = await this.evaluatePromotionEligibility(employeeId);
    if (!eligibility.isEligible || !eligibility.nextLevel) {
      throw new Error(`Employee is not eligible for promotion: ${eligibility.summary}`);
    }

    return await prisma.$transaction(async (tx) => {
      const employee = await tx.employee.findUnique({
        where: { id: employeeId },
        include: {
          department: true,
          jobRole: true
        }
      });

      if (!employee) throw new Error('Employee not found');

      const nextRole = await tx.jobRole.findFirst({
        where: {
          track: employee.jobRole.track,
          level: eligibility.nextLevel!
        },
        include: { salaryBand: true }
      });

      if (!nextRole) {
        throw new Error(`Target role for level ${eligibility.nextLevel} not found in track.`);
      }

      // 1. Record Career History for past role
      await tx.careerHistory.create({
        data: {
          employeeId: employee.id,
          roleTitle: employee.jobRole.title,
          departmentName: employee.department.name,
          salary: employee.currentSalary,
          promotedAt: new Date(),
          notes: `Promoted to ${nextRole.title}`
        }
      });

      // 2. Update employee to new role and new base salary
      const newSalary = nextRole.salaryBand.minSalary;
      const updatedEmployee = await tx.employee.update({
        where: { id: employee.id },
        data: {
          jobRoleId: nextRole.id,
          currentSalary: newSalary
        },
        include: { jobRole: true }
      });

      // 3. Log HR congratulatory record
      await tx.hRRecord.create({
        data: {
          employeeId: employee.id,
          type: HRActionType.COMMENDATION,
          reason: `Promoted from ${employee.jobRole.title} to ${nextRole.title}. Salary updated to ₦${newSalary.toLocaleString()}.`
        }
      });

      return {
        success: true,
        promotedRole: nextRole.title,
        newSalary,
        employee: updatedEmployee
      };
    });
  }
}
