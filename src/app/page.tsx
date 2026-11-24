import React from 'react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { PlayerService } from '@/services/player.service';
import {
  AgencyLandingLauncher,
  type LandingSessionInfo
} from '@/components/landing/AgencyLandingLauncher';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let session: LandingSessionInfo = {
    isAuthenticated: false,
    needsOnboarding: true
  };

  try {
    const supabase = createServerSupabaseClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (user) {
      const player = await PlayerService.getPlayerByAuthId(user.id).catch(() => null);
      const activeEmployee = player?.employees?.[0] ?? null;

      session = {
        isAuthenticated: true,
        email: user.email,
        displayName: player?.profile?.displayName ?? null,
        needsOnboarding: !player?.profile || !activeEmployee,
        roleTitle: activeEmployee?.jobRole?.title ?? null,
        unitCode: activeEmployee?.organisationUnit?.code ?? null
      };
    }
  } catch {
    // Public visitor landing page remains resilient even if auth/session check fails
  }

  return <AgencyLandingLauncher session={session} />;
}
