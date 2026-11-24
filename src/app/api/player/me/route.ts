import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { PlayerService } from '@/services/player.service';

export const dynamic = 'force-dynamic';

/**
 * GET /api/player/me
 * Server-authoritative identity endpoint.
 * Resolves the authenticated Supabase session, ensures a base `Player` row exists,
 * and returns the player's profile, active employment spell, and onboarding state.
 */
export async function GET() {
  try {
    const supabase = createServerSupabaseClient();
    const {
      data: { user },
      error
    } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json(
        { authenticated: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const player = await PlayerService.ensureAndGetPlayer({ id: user.id, email: user.email });

    const activeEmployee = player.employees?.[0] ?? null;
    const needsOnboarding = !player.profile || !activeEmployee;

    return NextResponse.json({
      authenticated: true,
      needsOnboarding,
      user: {
        id: user.id,
        email: user.email
      },
      player: player
        ? {
            id: player.id,
            status: player.status,
            profile: player.profile,
            employee: activeEmployee
          }
        : null
    });
  } catch (err) {
    console.error('[API /api/player/me] Error:', err);
    return NextResponse.json(
      { error: 'Failed to load player record' },
      { status: 500 }
    );
  }
}

