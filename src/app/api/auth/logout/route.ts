import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

/**
 * POST /api/auth/logout
 * Clears the Supabase SSR session cookies cleanly on the server.
 */
export async function POST() {
  try {
    const supabase = createServerSupabaseClient();
    await supabase.auth.signOut();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[API /api/auth/logout] Error:', err);
    return NextResponse.json({ error: 'Failed to sign out' }, { status: 500 });
  }
}

