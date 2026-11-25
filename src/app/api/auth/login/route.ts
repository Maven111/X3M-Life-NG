import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { PlayerService, extractAuthIdentity } from '@/services/player.service';

export const dynamic = 'force-dynamic';

const LoginPayloadSchema = z.object({
  identifier: z.string().trim().min(2, 'Please enter your username or email.').max(255),
  password: z.string().min(1, 'Please enter your password.').max(255)
});

/**
 * POST /api/auth/login
 * Authenticates a player using either their username or email address + password.
 * Resolves username -> email strictly on the server so emails are never leaked to the browser.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { identifier, password } = LoginPayloadSchema.parse(body);

    let emailToUse: string | null = null;
    if (identifier.includes('@')) {
      emailToUse = identifier.toLowerCase();
    } else {
      emailToUse = await PlayerService.findEmailByUsername(identifier);
    }

    if (!emailToUse) {
      return NextResponse.json(
        { error: 'Invalid username/email or password.' },
        { status: 401 }
      );
    }

    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: emailToUse,
      password
    });

    if (error || !data.user) {
      // Surface email-not-confirmed clearly; keep other auth failures generic
      const isUnconfirmed = error?.message?.toLowerCase().includes('email not confirmed');
      return NextResponse.json(
        {
          error: isUnconfirmed
            ? 'Please confirm your email address from your inbox before clocking in.'
            : 'Invalid username/email or password.'
        },
        { status: 401 }
      );
    }

    const player = await PlayerService.ensureAndGetPlayer(extractAuthIdentity(data.user));
    const needsOnboarding = !player.profile || !player.employees.length;

    return NextResponse.json({
      success: true,
      needsOnboarding
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: err.issues[0]?.message || 'Invalid credentials.' },
        { status: 400 }
      );
    }
    console.error('[API /api/auth/login] Error:', err);
    return NextResponse.json(
      { error: 'Unable to clock in right now. Please try again.' },
      { status: 500 }
    );
  }
}

