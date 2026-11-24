'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  PenTool,
  Palette,
  Compass,
  TrendingUp,
  Briefcase,
  Play,
  LogIn,
  LogOut,
  UserCheck
} from 'lucide-react';
import { BrandLogo, Button, Badge } from '@/components/ui';
import { AnimatedHeroBackdrop } from './AnimatedHeroBackdrop';

export interface LandingSessionInfo {
  isAuthenticated: boolean;
  email?: string | null;
  displayName?: string | null;
  needsOnboarding: boolean;
  roleTitle?: string | null;
  unitCode?: string | null;
}

interface TrackTile {
  code: string;
  name: string;
  shortName: string;
  entryTitle: string;
  topTitle: string;
  sampleBrief: string;
  salaryHint: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TRACK_TILES: TrackTile[] = [
  {
    code: 'COPYWRITING',
    name: 'Copywriting',
    shortName: 'Copy',
    entryTitle: 'Graduate Copywriter',
    topTitle: 'Creative Director (Copy)',
    sampleBrief: 'Pitch a punchy Lagos billboard & radio tagline for a fintech launch before 5:00 PM.',
    salaryHint: '₦120k – ₦200k / mo (Entry Game Band)',
    icon: PenTool
  },
  {
    code: 'ART_DIRECTION',
    name: 'Art Direction',
    shortName: 'Art Dir.',
    entryTitle: 'Graduate Art Director',
    topTitle: 'Creative Director (Art)',
    sampleBrief: 'Direct the visual moodboard & key visual system for an integrated brand campaign.',
    salaryHint: '₦120k – ₦200k / mo (Entry Game Band)',
    icon: Palette
  },
  {
    code: 'BRAND_STRATEGY',
    name: 'Brand Strategy',
    shortName: 'Strategy',
    entryTitle: 'Graduate Strategy Analyst',
    topTitle: 'Strategy Director',
    sampleBrief: 'Uncover the core Nigerian consumer insight that wins the agency pitch room.',
    salaryHint: '₦120k – ₦200k / mo (Entry Game Band)',
    icon: Compass
  },
  {
    code: 'DIGITAL_STRATEGY',
    name: 'Digital Strategy',
    shortName: 'Digital',
    entryTitle: 'Graduate Digital Analyst',
    topTitle: 'Head of Digital Strategy',
    sampleBrief: 'Architect a high-conversion social & paid digital rollout across channels.',
    salaryHint: '₦120k – ₦200k / mo (Entry Game Band)',
    icon: TrendingUp
  },
  {
    code: 'BRAND_MANAGEMENT',
    name: 'Brand Management',
    shortName: 'Accounts',
    entryTitle: 'Graduate Account Executive',
    topTitle: 'Group Account Director',
    sampleBrief: 'Keep demanding clients happy, align BU1–BU3 creatives, and deliver on deadline.',
    salaryHint: '₦120k – ₦200k / mo (Entry Game Band)',
    icon: Briefcase
  }
];

export function AgencyLandingLauncher({ session }: { session: LandingSessionInfo }) {
  const router = useRouter();
  const [selectedCode, setSelectedCode] = useState<string>(TRACK_TILES[0].code);
  const [signingOut, setSigningOut] = useState(false);

  const activeTrack = TRACK_TILES.find((t) => t.code === selectedCode) || TRACK_TILES[0];

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  };

  const primaryHref = !session.isAuthenticated
    ? '/register'
    : session.needsOnboarding
      ? '/onboarding'
      : '/dashboard';

  const primaryLabel = !session.isAuthenticated
    ? 'Apply to X3M Ideas'
    : session.needsOnboarding
      ? 'Resume Onboarding'
      : 'Enter Agency Dashboard';

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-brand-charcoal text-brand-white flex flex-col justify-between">
      {/* Full-bleed Living Hero Key Art (Coordinate-Locked Blinking + Silver Butterfly Pendant) */}
      <AnimatedHeroBackdrop />
      {/* Light, color-preserving scrim: keeps sunset & both character duos vibrant while giving centered text crisp contrast */}
      <div
        className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_55%_65%_at_50%_52%,rgba(17,24,39,0.68)_0%,rgba(17,24,39,0.28)_58%,transparent_88%)]"
        aria-hidden="true"
      />
      <div
        className="fixed inset-0 pointer-events-none bg-gradient-to-b from-brand-charcoal/40 via-transparent to-brand-charcoal/35"
        aria-hidden="true"
      />
      {/* Warm X3M amber/crimson edge lighting glow */}
      <div
        className="fixed -top-24 left-1/2 -translate-x-1/2 w-[560px] h-64 rounded-m3-full bg-primary/15 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* =====================================================================
          TOP HUD BAR (FULL WIDTH SO LOGO ALIGNS LEFT & SIGN IN ALIGNS RIGHT)
          ===================================================================== */}
      <header className="relative z-10 w-full px-5 sm:px-8 pt-5 pb-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center focus:outline-none">
            <BrandLogo
              size="md"
              variant="light"
              className="opacity-95 hover:opacity-100 transition-opacity drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]"
            />
          </Link>

          {session.isAuthenticated && !session.needsOnboarding && (
            <nav className="hidden md:flex items-center gap-6 text-sm font-display font-semibold">
              <Link
                href="/dashboard"
                className="text-brand-white/75 hover:text-brand-white transition-colors pb-1"
              >
                My Desk
              </Link>
            </nav>
          )}
        </div>

        {/* Right HUD Controls: Sign In (visitors) or User + Sign Out (authenticated) */}
        {session.isAuthenticated ? (
          <div className="flex items-center gap-2.5">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-m3-full bg-brand-white/10 border border-brand-white/15 backdrop-blur-md text-xs font-body">
              <UserCheck className="w-3.5 h-3.5 text-success" />
              <span className="max-w-[150px] truncate text-brand-white/90">
                {session.displayName || session.email || 'Signed In'}
              </span>
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              disabled={signingOut}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-m3-full bg-brand-white/10 hover:bg-error/85 border border-brand-white/20 text-xs font-semibold font-body text-brand-white transition-all cursor-pointer disabled:opacity-50"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{signingOut ? 'Signing Out...' : 'Sign Out'}</span>
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-m3-full bg-brand-white/12 hover:bg-brand-white/22 border border-brand-white/25 backdrop-blur-md text-xs sm:text-sm font-display font-semibold text-brand-white transition-all shadow-elevation-1"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </Link>
        )}
      </header>

      {/* =====================================================================
          MAIN GAME LAUNCHER CONTENT (CENTERED)
          ===================================================================== */}
      <main className="relative z-10 w-full max-w-5xl mx-auto px-5 sm:px-8 flex-1 flex flex-col items-center justify-center text-center py-6 sm:py-10">
        {/* Interactive Career Track Tile Strip */}
        <section aria-label="Career Track Selector" className="mb-8 w-full flex justify-center">
          <div className="flex items-center justify-center flex-wrap gap-3 pb-2">
            {TRACK_TILES.map((track) => {
              const Icon = track.icon;
              const isSelected = track.code === activeTrack.code;
              return (
                <button
                  key={track.code}
                  type="button"
                  onClick={() => setSelectedCode(track.code)}
                  className={`group relative flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-m3-lg flex flex-col items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer backdrop-blur-md ${
                    isSelected
                      ? 'bg-brand-gradient-primary text-brand-white ring-2 ring-brand-white shadow-elevation-4 scale-105'
                      : 'bg-brand-charcoal/70 hover:bg-brand-charcoal/90 text-brand-white/75 hover:text-brand-white border border-brand-white/15'
                  }`}
                >
                  <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${isSelected ? 'text-brand-white' : 'text-tertiary'}`} />
                  <span className="text-[11px] font-display font-bold tracking-tight">
                    {track.shortName}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Hero Editorial Stack (Centered) */}
        <section className="max-w-2xl mx-auto flex flex-col items-center text-center space-y-5">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight leading-[1.08] text-brand-white">
            Clock In. Pitch Big.{' '}
            <span className="text-transparent bg-clip-text bg-brand-gradient-accent">
              Own Lagos.
            </span>
          </h1>

          <p className="text-sm sm:text-base lg:text-lg font-body text-brand-white/85 leading-relaxed max-w-xl">
            Step into the 9–5 hustle at <strong className="text-brand-white font-semibold">X3M Ideas</strong>.
            Start at entry level, crack creative briefs before client deadlines, negotiate your Naira salary,
            survive HR queries, and build your dream agency career.
          </p>

          {/* Active Track Spotlight Micro-Brief */}
          <div className="w-full p-4 rounded-m3-md bg-brand-charcoal/75 border border-brand-white/15 backdrop-blur-md max-w-xl text-left">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
              <span className="text-xs font-display font-bold uppercase tracking-wider text-tertiary">
                Sample 9–5 Brief · {activeTrack.name}
              </span>
              <Badge variant="default" size="sm" className="bg-brand-white/10 text-brand-white border-brand-white/15">
                {activeTrack.salaryHint}
              </Badge>
            </div>
            <p className="text-xs sm:text-sm font-body text-brand-white/85 leading-relaxed">
              {activeTrack.sampleBrief}
            </p>
          </div>

          {/* Primary Action Pill */}
          <div className="pt-2 flex flex-wrap items-center justify-center">
            <Link href={primaryHref}>
              <Button
                variant="primary-gradient"
                size="lg"
                className="px-8 py-3.5 text-sm sm:text-base shadow-elevation-3"
                icon={<Play className="w-4 h-4 fill-current" />}
              >
                {primaryLabel}
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

