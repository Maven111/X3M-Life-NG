import { NextRequest, NextResponse } from 'next/server';
import { PlayerService } from '@/services/player.service';

export const dynamic = 'force-dynamic';

/**
 * GET /api/auth/check-username?username=...
 * Validates username format and checks case-insensitive availability against `players.username`.
 */
export async function GET(request: NextRequest) {
  try {
    const username = request.nextUrl.searchParams.get('username') ?? '';
    const result = await PlayerService.isUsernameAvailable(username);
    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.error('[API /api/auth/check-username] Error:', err);
    return NextResponse.json(
      { available: false, normalized: null, reason: 'Unable to verify username right now.' },
      { status: 500 }
    );
  }
}

