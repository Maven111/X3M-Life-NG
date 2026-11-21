import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';

/**
 * Server-Side Gemini API Client Wrapper
 * Target Model: gemini-2.5-flash (approved for latency, schema adherence, and cost)
 *
 * NOTE: This module must ONLY be called from server-side services (Route Handlers / Server Actions).
 * Direct client-side calls are prohibited to prevent API key exposure.
 */

const apiKey = process.env.GEMINI_API_KEY || '';

// Singleton SDK instance
export const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const DEFAULT_GEMINI_MODEL = 'gemini-2.5-flash';

/**
 * Strict evaluation schema returned by Gemini for subjective advertising/marketing briefs.
 */
export const BriefEvaluationSchema = z.object({
  score: z.number().int().min(0).max(100),
  summary: z.string().min(10),
  strengths: z.string().min(5),
  areasForImprovement: z.string().min(5),
  feedback: z.string().min(10)
});

export type BriefEvaluationResult = z.infer<typeof BriefEvaluationSchema>;

/**
 * Evaluate a player's subjective brief proposal against a fixed scoring rubric.
 */
export async function evaluateBriefSubmission(params: {
  briefTitle: string;
  briefDescription: string;
  careerTrack: string;
  rubric: Record<string, unknown>;
  submissionContent: string;
}): Promise<BriefEvaluationResult> {
  if (!ai) {
    // Graceful fallback for offline development or missing API key
    console.warn('[Gemini Service] GEMINI_API_KEY is not configured. Returning deterministic mock evaluation.');
    return {
      score: 75,
      summary: 'Evaluation completed using local development fallback.',
      strengths: 'Good creative direction and alignment with the brief requirements.',
      areasForImprovement: 'Expand on the consumer insight and measurable campaign metrics.',
      feedback: 'Solid effort! Consider tailoring the tone more directly to the target demographic.'
    };
  }

  const prompt = `
You are the Creative Director at X3M Ideas, an elite Nigerian creative agency.
Evaluate the following employee submission for the given advertising brief.

BRIEF TITLE: "${params.briefTitle}"
CAREER TRACK: ${params.careerTrack}
BRIEF DESCRIPTION:
${params.briefDescription}

APPROVED SCORING RUBRIC:
${JSON.stringify(params.rubric, null, 2)}

EMPLOYEE SUBMISSION:
"""
${params.submissionContent}
"""

Evaluate objectively against the rubric. Provide a score between 0 and 100, constructive agency-level feedback, key strengths, and specific areas for improvement.
`;

  try {
    const response = await ai.models.generateContent({
      model: DEFAULT_GEMINI_MODEL,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2 // Low temperature for deterministic, consistent grading
      }
    });

    const responseText = response.text || '{}';
    const parsedJson = JSON.parse(responseText);

    return BriefEvaluationSchema.parse(parsedJson);
  } catch (error) {
    console.error('[Gemini Service] Evaluation generation error:', error);
    throw new Error('Failed to evaluate brief submission via AI service.');
  }
}

