import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { PlayerService } from '@/services/player.service';
import { Card, Badge, Button, BrandLogo } from '@/components/ui';
import { LogoutButton } from '@/components/auth/LogoutButton';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirectedFrom=/dashboard');
  }

  const player = await PlayerService.ensureAndGetPlayer({ id: user.id, email: user.email });
  const employee = player.employees?.[0];

  if (!player.profile || !employee) {
    redirect('/onboarding');
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-outline-variant/50">
          <div className="flex items-center gap-4">
            <BrandLogo size="md" />
            <div>
              <h1 className="text-xl font-bold font-heading text-foreground">
                {player.profile.displayName}
              </h1>
              <p className="text-xs text-surface-foreground/70 font-body">
                {employee.jobRole.title} · {employee.organisationUnit.name} ({employee.organisationUnit.code})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/preview">
              <Button variant="tonal" size="sm">3D Character Preview</Button>
            </Link>
            <LogoutButton />
          </div>
        </div>

        {/* Verified Employee Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card variant="elevated" elevation="elevation-1">
            <div className="text-xs font-semibold uppercase tracking-wider text-surface-foreground/60 font-heading">
              Career Track
            </div>
            <div className="text-lg font-bold font-heading text-foreground mt-1">
              {employee.jobRole.careerTrack.name}
            </div>
            <div className="mt-2">
              <Badge variant="primary" size="sm">Level {employee.jobRole.level}</Badge>
            </div>
          </Card>

          <Card variant="elevated" elevation="elevation-1">
            <div className="text-xs font-semibold uppercase tracking-wider text-surface-foreground/60 font-heading">
              Starting Game Salary
            </div>
            <div className="text-lg font-bold font-heading text-foreground mt-1">
              ₦{employee.currentSalary.toLocaleString()}/mo
            </div>
            <div className="text-xs text-surface-foreground/65 mt-1 font-body">
              Band: ₦{employee.jobRole.salaryBand.minSalary.toLocaleString()} – ₦{employee.jobRole.salaryBand.maxSalary.toLocaleString()}
            </div>
          </Card>

          <Card variant="elevated" elevation="elevation-1">
            <div className="text-xs font-semibold uppercase tracking-wider text-surface-foreground/60 font-heading">
              Employment Status
            </div>
            <div className="mt-2 flex items-center gap-2">
              <Badge variant="success" size="md">{employee.status}</Badge>
              <Badge variant="default" size="sm">Score: {Math.round(employee.performanceScore)}%</Badge>
            </div>
            <div className="text-xs text-surface-foreground/65 mt-2 font-body">
              Unit: {employee.organisationUnit.code} · Day {employee.hiredGameDay}
            </div>
          </Card>
        </div>

        {/* Character Profile Details */}
        <Card variant="outlined">
          <h2 className="text-base font-bold font-heading mb-3 text-foreground">Character Profile</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm font-body">
            <div>
              <span className="block text-xs text-surface-foreground/60">Presentation</span>
              <span className="font-medium capitalize">{player.profile.genderPresentation.replace('_', ' ')}</span>
            </div>
            <div>
              <span className="block text-xs text-surface-foreground/60">Outfit</span>
              <span className="font-medium capitalize">{player.profile.outfitKey.replace('_', ' ')}</span>
            </div>
            <div>
              <span className="block text-xs text-surface-foreground/60">Skin Tone</span>
              <span className="font-medium capitalize">{player.profile.skinTone.replace('_', ' ')}</span>
            </div>
            <div>
              <span className="block text-xs text-surface-foreground/60">Hairstyle</span>
              <span className="font-medium capitalize">{player.profile.hairstyle.replace('_', ' ')}</span>
            </div>
          </div>
        </Card>

        {/* Career History */}
        <Card variant="elevated" elevation="elevation-1">
          <h2 className="text-base font-bold font-heading mb-3 text-foreground">Career History</h2>
          <div className="space-y-3">
            {employee.careerHistories.map((entry) => (
              <div
                key={entry.id}
                className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-m3-md bg-surface-container/60 border border-outline-variant/40"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="info" size="sm">{entry.eventType}</Badge>
                    <span className="text-sm font-semibold font-heading text-foreground">
                      {entry.roleTitleSnapshot} (Level {entry.levelSnapshot})
                    </span>
                  </div>
                  {entry.notes && (
                    <p className="text-xs text-surface-foreground/70 mt-1 font-body">{entry.notes}</p>
                  )}
                </div>
                <div className="text-right text-xs text-surface-foreground/70 font-body">
                  <div className="font-semibold text-foreground">₦{entry.salarySnapshot.toLocaleString()}/mo</div>
                  <div>{entry.unitNameSnapshot} · Day {entry.effectiveGameDay}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

