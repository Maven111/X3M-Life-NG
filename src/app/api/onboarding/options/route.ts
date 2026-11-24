import { NextResponse } from 'next/server';
import { PlayerService } from '@/services/player.service';

export const dynamic = 'force-dynamic';

/**
 * GET /api/onboarding/options
 * Returns active career tracks (with Level-1 role titles & fictional game salary bands)
 * and Business Units (BU1, BU2, BU3) from PostgreSQL.
 */
export async function GET() {
  try {
    const options = await PlayerService.getOnboardingOptions();
    return NextResponse.json(options);
  } catch (err) {
    console.error('[API /api/onboarding/options] Error:', err);
    return NextResponse.json(
      { error: 'Failed to load onboarding options' },
      { status: 500 }
    );
  }
}

