import { prisma } from '@/lib/prisma';
import { AssignmentStatus } from '@prisma/client';
import { evaluateBriefSubmission, BriefEvaluationResult } from '@/lib/ai/gemini';
import { EconomyService } from './economy.service';

export interface SubmitBriefParams {
  assignmentId: string;
  submissionContent: string;
}

export class BriefService {
  /**
   * Submit player work for a brief assignment, evaluate with Gemini AI, and authoritatively credit rewards.
   */
  public static async processBriefSubmission(params: SubmitBriefParams) {
    const { assignmentId, submissionContent } = params;

    // 1. Fetch assignment details
    const assignment = await prisma.briefAssignment.findUnique({
      where: { id: assignmentId },
      include: {
        brief: true,
        employee: {
          include: {
            department: true,
            jobRole: {
              include: { salaryBand: true }
            },
            player: {
              include: {
                profile: true,
                wallet: true
              }
            }
          }
        }
      }
    });

    if (!assignment) {
      throw new Error(`Brief assignment not found: ${assignmentId}`);
    }

    if (assignment.status === AssignmentStatus.SUBMITTED) {
      throw new Error('This brief has already been submitted and completed.');
    }

    // 2. Evaluate with Gemini AI (Creative Director persona)
    const evaluationResult: BriefEvaluationResult = await evaluateBriefSubmission({
      briefTitle: assignment.brief.title,
      briefDescription: assignment.brief.description,
      careerTrack: assignment.employee.jobRole.track,
      rubric: (assignment.brief.rubricSnapshot as Record<string, unknown>) || {},
      submissionContent
    });

    // 3. Compute rewards based on grade
    const baseReward = assignment.brief.rewardAmount;
    let scoreMultiplier = 1.0;

    if (evaluationResult.score >= 90) {
      scoreMultiplier = 1.25; // 25% excellence bonus
    } else if (evaluationResult.score >= 75) {
      scoreMultiplier = 1.0;
    } else if (evaluationResult.score >= 60) {
      scoreMultiplier = 0.8;
    } else {
      scoreMultiplier = 0.5;
    }

    const calculatedReward = Math.round(baseReward * scoreMultiplier);

    // 4. Authoritative persistence inside atomic database transaction
    return await prisma.$transaction(async (tx) => {
      // Create BriefSubmission
      const submission = await tx.briefSubmission.create({
        data: {
          assignmentId: assignment.id,
          content: submissionContent
        }
      });

      // Create Evaluation record
      await tx.evaluation.create({
        data: {
          submissionId: submission.id,
          score: evaluationResult.score,
          summary: evaluationResult.summary,
          strengths: evaluationResult.strengths,
          improvements: evaluationResult.areasForImprovement,
          evaluatedBy: 'Gemini 2.5 Flash (Creative Director)'
        }
      });

      // Update assignment status
      await tx.briefAssignment.update({
        where: { id: assignment.id },
        data: {
          status: AssignmentStatus.SUBMITTED
        }
      });

      // Update employee performance score
      await tx.employee.update({
        where: { id: assignment.employee.id },
        data: {
          performanceScore: evaluationResult.score
        }
      });

      // Credit wallet
      if (assignment.employee.player.wallet) {
        await EconomyService.executeTransaction({
          walletId: assignment.employee.player.wallet.id,
          amount: calculatedReward,
          type: 'BRIEF_REWARD',
          description: `Reward: Completed "${assignment.brief.title}" (Score: ${evaluationResult.score}%)`,
          referenceId: `brief_${assignment.id}_reward`
        });
      }

      return {
        success: true,
        assignmentId: assignment.id,
        evaluation: {
          score: evaluationResult.score,
          summary: evaluationResult.summary,
          strengths: evaluationResult.strengths,
          improvements: evaluationResult.areasForImprovement,
          feedback: evaluationResult.feedback
        },
        reward: {
          baseReward,
          multiplier: scoreMultiplier,
          finalAmount: calculatedReward
        }
      };
    });
  }
}
