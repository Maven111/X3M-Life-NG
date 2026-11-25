import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { PlayerService, extractAuthIdentity } from '@/services/player.service';

export const dynamic = 'force-dynamic';

/**
 * Validates that a `next` redirect parameter is a safe internal relative path
 * (starts with `/` and not `//`, preventing open redirects).
 */
function getSafeNextPath(nextParam: string | null): string | null {
  if (!nextParam) return null;
  if (!nextParam.startsWith('/') || nextParam.startsWith('//')) return null;
  return nextParam;
}

/**
 * GET /auth/callback
 * Exchanges Supabase Auth confirmation / PKCE / recovery code for session cookies,
 * ensures the base Player record exists, and routes to a safe `?next=` path or
 * `/onboarding` / `/dashboard`.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const safeNext = getSafeNextPath(searchParams.get('next'));

  if (code) {
    const supabase = createServerSupabaseClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (user) {
        const authIdentity = extractAuthIdentity(user);

        if (safeNext) {
          // Non-blocking player sync for recovery/deep-link flows (e.g. /reset-password)
          try {
            await PlayerService.ensureAndGetPlayer(authIdentity);
          } catch (dbErr) {
            console.error('[Auth Callback] Player sync error before next redirect:', dbErr);
          }
          return NextResponse.redirect(`${origin}${safeNext}`);
        }

        try {
          const player = await PlayerService.ensureAndGetPlayer(authIdentity);
          const needsOnboarding = !player.profile || !player.employees.length;
          return NextResponse.redirect(`${origin}${needsOnboarding ? '/onboarding' : '/dashboard'}`);
        } catch (dbErr) {
          console.error('[Auth Callback] Player sync error:', dbErr);
          // Session is already established in cookies; send user to /onboarding to retry cleanly
          return NextResponse.redirect(`${origin}/onboarding`);
        }
      }
    }
  }

  return NextResponse.redirect(`${origin}/auth?mode=login&error=auth_callback_failed`);
}

