'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Button, Alert, Badge, BrandLogo } from '@/components/ui';
import { LogoutButton } from '@/components/auth/LogoutButton';
import {
  DEFAULT_CHARACTER_APPEARANCE,
  GENDER_OPTIONS,
  HAIRSTYLE_OPTIONS,
  OUTFIT_OPTIONS,
  SKIN_TONE_OPTIONS
} from '@/config/character-options';

interface TrackOption {
  code: string;
  name: string;
  description: string;
  entryRole: {
    title: string;
    level: number;
    description: string;
    salaryBand: {
      minSalary: number;
      maxSalary: number;
      currency: string;
    };
  } | null;
}

interface UnitOption {
  code: string;
  name: string;
  description: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [tracks, setTracks] = useState<TrackOption[]>([]);
  const [units, setUnits] = useState<UnitOption[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  const [displayName, setDisplayName] = useState('');
  const [genderPresentation, setGenderPresentation] = useState<string>(
    DEFAULT_CHARACTER_APPEARANCE.genderPresentation
  );
  const [skinTone, setSkinTone] = useState<string>(DEFAULT_CHARACTER_APPEARANCE.skinTone);
  const [hairstyle, setHairstyle] = useState<string>(DEFAULT_CHARACTER_APPEARANCE.hairstyle);
  const [outfitKey, setOutfitKey] = useState<string>(DEFAULT_CHARACTER_APPEARANCE.outfitKey);
  const [careerTrackCode, setCareerTrackCode] = useState('');
  const [organisationUnitCode, setOrganisationUnitCode] = useState<string>(
    DEFAULT_CHARACTER_APPEARANCE.organisationUnitCode
  );

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function init() {
      try {
        const [meRes, optRes] = await Promise.all([
          fetch('/api/player/me'),
          fetch('/api/onboarding/options')
        ]);

        if (meRes.status === 401) {
          router.push('/login');
          return;
        }
        const meData = await meRes.json();
        if (meData.authenticated && !meData.needsOnboarding) {
          router.push('/dashboard');
          return;
        }

        if (!optRes.ok) {
          throw new Error('Failed to load career tracks and business units.');
        }
        const optData = await optRes.json();
        if (!active) return;

        setTracks(optData.careerTracks || []);
        setUnits(optData.businessUnits || []);
        if (optData.careerTracks?.length > 0) {
          setCareerTrackCode(optData.careerTracks[0].code);
        }
        if (optData.businessUnits?.length > 0) {
          setOrganisationUnitCode(optData.businessUnits[0].code);
        }
      } catch (err: unknown) {
        if (!active) return;
        setErrorMsg(err instanceof Error ? err.message : 'Unable to load onboarding data.');
      } finally {
        if (active) setLoadingOptions(false);
      }
    }
    init();
    return () => {
      active = false;
    };
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/player/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName,
          genderPresentation,
          skinTone,
          hairstyle,
          outfitKey,
          careerTrackCode,
          organisationUnitCode
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Could not complete onboarding.');
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Unexpected error while saving profile.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingOptions) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-6">
        <Card variant="elevated" className="max-w-md w-full text-center py-10">
          <p className="text-sm font-body text-surface-foreground/70">Loading X3M Ideas onboarding...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background text-foreground py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-end mb-2">
          <LogoutButton />
        </div>
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <BrandLogo size="lg" />
          </div>
          <h1 className="text-3xl font-bold font-heading tracking-tight text-foreground">
            Welcome to X3M Ideas
          </h1>
          <p className="text-sm text-surface-foreground/70 mt-1 font-body">
            Step 2 of 2: Create your employee character and choose your entry-level career track
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6">
            <Alert variant="error" onClose={() => setErrorMsg(null)}>
              {errorMsg}
            </Alert>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Character Profile */}
          <Card variant="elevated" elevation="elevation-1" className="border border-outline-variant/50">
            <h2 className="text-lg font-bold font-heading mb-4 text-foreground">1. Employee Identity & Appearance</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-surface-foreground/80 mb-1.5 font-heading">
                  Employee Display Name
                </label>
                <input
                  type="text"
                  required
                  minLength={2}
                  maxLength={80}
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Chidinma Okafor"
                  className="w-full px-4 py-2.5 rounded-m3-md bg-surface-container text-foreground border border-outline/40 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm font-body"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-surface-foreground/80 mb-1.5 font-heading">
                  Gender Presentation
                </label>
                <select
                  value={genderPresentation}
                  onChange={(e) => setGenderPresentation(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-m3-md bg-surface-container text-foreground border border-outline/40 focus:border-primary outline-none text-sm font-body"
                >
                  {GENDER_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-surface-foreground/80 mb-1.5 font-heading">
                  Office Style
                </label>
                <select
                  value={outfitKey}
                  onChange={(e) => setOutfitKey(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-m3-md bg-surface-container text-foreground border border-outline/40 focus:border-primary outline-none text-sm font-body"
                >
                  {OUTFIT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-surface-foreground/80 mb-1.5 font-heading">
                  Skin Tone
                </label>
                <select
                  value={skinTone}
                  onChange={(e) => setSkinTone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-m3-md bg-surface-container text-foreground border border-outline/40 focus:border-primary outline-none text-sm font-body"
                >
                  {SKIN_TONE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-surface-foreground/80 mb-1.5 font-heading">
                  Hairstyle
                </label>
                <select
                  value={hairstyle}
                  onChange={(e) => setHairstyle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-m3-md bg-surface-container text-foreground border border-outline/40 focus:border-primary outline-none text-sm font-body"
                >
                  {HAIRSTYLE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          {/* Career Track Selection (loaded from PostgreSQL) */}
          <Card variant="elevated" elevation="elevation-1" className="border border-outline-variant/50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold font-heading text-foreground">2. Choose Your Career Track</h2>
              <Badge variant="info" size="sm">Entry Level (Level 1)</Badge>
            </div>
            <div className="space-y-3">
              {tracks.map((track) => (
                <label
                  key={track.code}
                  className={`flex items-start gap-3 p-4 rounded-m3-md border cursor-pointer transition-all ${
                    careerTrackCode === track.code
                      ? 'border-primary bg-primary/5 shadow-elevation-1'
                      : 'border-outline/30 hover:border-outline bg-surface-container/40'
                  }`}
                >
                  <input
                    type="radio"
                    name="careerTrackCode"
                    value={track.code}
                    checked={careerTrackCode === track.code}
                    onChange={(e) => setCareerTrackCode(e.target.value)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm font-bold font-heading text-foreground">{track.name}</span>
                      {track.entryRole && (
                        <Badge variant="default" size="sm">
                          {track.entryRole.title} · ₦{track.entryRole.salaryBand.minSalary.toLocaleString()}–₦{track.entryRole.salaryBand.maxSalary.toLocaleString()}/mo
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-surface-foreground/75 mt-1 font-body">{track.description}</p>
                  </div>
                </label>
              ))}
            </div>
            <p className="text-[11px] text-surface-foreground/55 mt-3 font-body">
              * Displayed salary bands are provisional fictional game values for simulation gameplay.
            </p>
          </Card>

          {/* Business Unit Placement */}
          <Card variant="elevated" elevation="elevation-1" className="border border-outline-variant/50">
            <h2 className="text-lg font-bold font-heading mb-4 text-foreground">3. Business Unit Placement</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {units.map((unit) => (
                <label
                  key={unit.code}
                  className={`p-4 rounded-m3-md border cursor-pointer transition-all ${
                    organisationUnitCode === unit.code
                      ? 'border-primary bg-primary/5 shadow-elevation-1'
                      : 'border-outline/30 hover:border-outline bg-surface-container/40'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <input
                      type="radio"
                      name="organisationUnitCode"
                      value={unit.code}
                      checked={organisationUnitCode === unit.code}
                      onChange={(e) => setOrganisationUnitCode(e.target.value)}
                    />
                    <span className="text-sm font-bold font-heading text-foreground">{unit.code}</span>
                  </div>
                  <div className="text-xs font-medium text-foreground/90">{unit.name}</div>
                  <p className="text-[11px] text-surface-foreground/70 mt-1 font-body">{unit.description}</p>
                </label>
              ))}
            </div>
          </Card>

          <Button type="submit" disabled={submitting} className="w-full py-3.5 shadow-elevation-2">
            {submitting ? 'Confirming Recruitment...' : 'Complete Onboarding & Join X3M Ideas'}
          </Button>
        </form>
      </div>
    </div>
  );
}

