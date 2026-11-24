import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { PlayerService } from '@/services/player.service';
import {
  DEFAULT_CHARACTER_APPEARANCE,
  ENTRY_BUSINESS_UNIT_CODES,
  GENDER_VALUES,
  HAIRSTYLE_VALUES,
  OUTFIT_VALUES,
  SKIN_TONE_VALUES
} from '@/config/character-options';

export const dynamic = 'force-dynamic';

const OnboardingPayloadSchema = z.object({
  displayName: z.string().trim().min(2, 'Display name must be at least 2 characters').max(80),
  genderPresentation: z.enum(GENDER_VALUES).default(DEFAULT_CHARACTER_APPEARANCE.genderPresentation),
  skinTone: z.enum(SKIN_TONE_VALUES).default(DEFAULT_CHARACTER_APPEARANCE.skinTone),
  hairstyle: z.enum(HAIRSTYLE_VALUES).default(DEFAULT_CHARACTER_APPEARANCE.hairstyle),
  outfitKey: z.enum(OUTFIT_VALUES).default(DEFAULT_CHARACTER_APPEARANCE.outfitKey),
  careerTrackCode: z.string().trim().min(2).max(32),
  organisationUnitCode: z
    .enum(ENTRY_BUSINESS_UNIT_CODES)
    .default(DEFAULT_CHARACTER_APPEARANCE.organisationUnitCode)
});

/**
 * POST /api/player/onboarding
 * Completes player character creation and entry-level X3M recruitment atomically.
 * Identity is strictly derived from the verified Supabase session cookie.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const {
      data: { user },
      error
    } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const validated = OnboardingPayloadSchema.parse(body);

    const result = await PlayerService.completeOnboarding(
      { id: user.id, email: user.email },
      validated
    );

    return NextResponse.json({ success: true, ...result }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid onboarding details', details: err.issues },
        { status: 400 }
      );
    }

    const message = err instanceof Error ? err.message : 'Failed to complete onboarding';
    const status =
      message.includes('already been completed') ? 409 :
      message.includes('Invalid') ? 400 : 500;

    console.error('[API /api/player/onboarding] Error:', message);
    return NextResponse.json({ error: message }, { status });
  }
}

