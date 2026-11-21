import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { evaluateBriefSubmission } from '@/lib/ai/gemini';

const SubmitBriefSchema = z.object({
  briefTitle: z.string().min(3),
  briefDescription: z.string().min(5),
  careerTrack: z.string(),
  rubric: z.record(z.string(), z.unknown()),
  submissionContent: z.string().min(10)
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = SubmitBriefSchema.parse(body);

    const evaluationResult = await evaluateBriefSubmission(validatedData);

    return NextResponse.json({
      success: true,
      evaluation: evaluationResult
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid brief submission payload', details: error.issues },
        { status: 400 }
      );
    }
    console.error('[API Briefs Evaluate] Error:', error);
    return NextResponse.json(
      { error: 'Failed to process brief evaluation' },
      { status: 500 }
    );
  }
}

