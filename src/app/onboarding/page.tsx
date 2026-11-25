'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Glasses,
  HardHat,
  Gem,
  Link2,
  Check,
  User,
  Palette,
  Scissors,
  Shirt
} from 'lucide-react';
import { Card, Button, Alert, Badge, BrandLogo } from '@/components/ui';
import { LogoutButton } from '@/components/auth/LogoutButton';
import {
  ACCESSORY_OPTIONS,
  DEFAULT_CHARACTER_APPEARANCE,
  GENDER_OPTIONS,
  HAIRSTYLE_OPTIONS_BY_GENDER,
  OUTFIT_COLOR_OPTIONS,
  OUTFIT_OPTIONS,
  SKIN_TONE_OPTIONS,
  type AccessoryValue,
  type GenderPresentationValue,
  type HairstyleValue,
  type OutfitColorValue,
  type OutfitKeyValue,
  type SkinToneValue
} from '@/config/character-options';

const CharacterStudio3D = dynamic(
  () => import('@/components/onboarding/CharacterStudio3D').then((mod) => mod.CharacterStudio3D),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[520px] lg:h-[640px] rounded-m3-xl border border-brand-white/15 bg-brand-charcoal flex flex-col items-center justify-center text-brand-white">
        <div className="w-10 h-10 border-4 border-brand-white/20 border-t-primary rounded-full animate-spin" />
        <p className="mt-3 text-xs font-display font-semibold tracking-wide text-brand-white/80">
          Loading 3D Character Studio...
        </p>
      </div>
    )
  }
);

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

const ACCESSORY_ICON_MAP: Record<AccessoryValue, React.ComponentType<{ className?: string }>> = {
  glasses: Glasses,
  cap: HardHat,
  earrings: Gem,
  neck_chain: Link2
};

export default function OnboardingPage() {
  const router = useRouter();
  const [tracks, setTracks] = useState<TrackOption[]>([]);
  const [units, setUnits] = useState<UnitOption[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  const [displayName, setDisplayName] = useState('');
  const [genderPresentation, setGenderPresentation] = useState<GenderPresentationValue>(
    DEFAULT_CHARACTER_APPEARANCE.genderPresentation
  );
  const [skinTone, setSkinTone] = useState<SkinToneValue>(DEFAULT_CHARACTER_APPEARANCE.skinTone);
  const [hairstyle, setHairstyle] = useState<HairstyleValue>(
    DEFAULT_CHARACTER_APPEARANCE.hairstyle
  );
  const [outfitKey, setOutfitKey] = useState<OutfitKeyValue>(
    DEFAULT_CHARACTER_APPEARANCE.outfitKey
  );
  const [outfitColor, setOutfitColor] = useState<OutfitColorValue>(
    DEFAULT_CHARACTER_APPEARANCE.outfitColor
  );
  const [accessories, setAccessories] = useState<AccessoryValue[]>(
    DEFAULT_CHARACTER_APPEARANCE.accessories
  );
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
          router.push('/auth?mode=login');
          return;
        }
        const meData = await meRes.json();
        if (meData.authenticated && !meData.needsOnboarding) {
          router.push('/dashboard');
          return;
        }

        // Auto-populate Employee Display Name from the username created during registration
        const preferredName = meData.player?.username || meData.player?.fullName || '';
        if (preferredName) {
          setDisplayName((prev) => prev || preferredName);
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

  const handleGenderChange = (nextGender: GenderPresentationValue) => {
    setGenderPresentation(nextGender);
    const validHairstyles = HAIRSTYLE_OPTIONS_BY_GENDER[nextGender];
    const stillValid = validHairstyles.some((h) => h.value === hairstyle);
    if (!stillValid && validHairstyles.length > 0) {
      setHairstyle(validHairstyles[0].value);
    }
  };

  const toggleAccessory = (acc: AccessoryValue) => {
    setAccessories((prev) =>
      prev.includes(acc) ? prev.filter((item) => item !== acc) : [...prev, acc]
    );
  };

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
          outfitColor,
          accessories,
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

  const genderHairstyles = HAIRSTYLE_OPTIONS_BY_GENDER[genderPresentation];
  const selectedTrack = tracks.find((t) => t.code === careerTrackCode);

  if (loadingOptions) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-charcoal text-brand-white p-6">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 mx-auto border-4 border-brand-white/20 border-t-primary rounded-full animate-spin" />
          <p className="text-sm font-display font-semibold text-brand-white/80">
            Preparing your X3M Ideas Studio...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-brand-charcoal text-foreground">
      {/* Vibrant Blended X3M Lagos Studio Background Layer */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 15% 15%, rgba(211,47,47,0.28) 0%, transparent 65%), radial-gradient(ellipse 65% 55% at 88% 20%, rgba(249,168,37,0.22) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 50% 95%, rgba(198,40,40,0.18) 0%, transparent 65%)'
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.4) 1px, transparent 1px)',
          backgroundSize: '48px 48px'
        }}
        aria-hidden="true"
      />

      {/* Top Bar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 pt-5 pb-3 flex items-center justify-between gap-4">
        <BrandLogo size="md" variant="light" />
        <div className="flex items-center gap-3">
          <Badge
            variant="default"
            size="sm"
            className="hidden sm:inline-flex bg-brand-white/10 text-brand-white border-brand-white/20 backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-tertiary mr-1" />
            Step 2 of 2 · Character &amp; Career Setup
          </Badge>
          <LogoutButton />
        </div>
      </header>

      {/* Main Split Studio Container */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 pt-2 pb-14">
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight text-brand-white">
            Style Your{' '}
            <span className="text-transparent bg-clip-text bg-brand-gradient-accent">
              X3M Ideas
            </span>{' '}
            Persona
          </h1>
          <p className="text-sm sm:text-base text-brand-white/75 mt-1 font-body max-w-2xl">
            Customize your look, choose your Lagos agency style, and lock in your entry-level
            career track before clocking into your first 9–5.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6">
            <Alert variant="error" onClose={() => setErrorMsg(null)}>
              {errorMsg}
            </Alert>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Sticky Reactive 3D Character Studio */}
          <div className="lg:col-span-5 lg:sticky lg:top-6 space-y-4">
            <CharacterStudio3D
              displayName={displayName}
              gender={genderPresentation}
              skinTone={skinTone}
              hairstyle={hairstyle}
              outfitKey={outfitKey}
              outfitColor={outfitColor}
              accessories={accessories}
              trackName={selectedTrack?.name}
              unitCode={organisationUnitCode}
            />
          </div>

          {/* RIGHT COLUMN: Customization Controls, Career Track & Business Unit */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Identity & Gender */}
            <Card
              variant="elevated"
              elevation="elevation-2"
              className="border border-brand-white/15 bg-surface/95 backdrop-blur-md"
            >
              <div className="flex items-center gap-2 mb-4">
                <User className="w-4 h-4 text-primary" />
                <h2 className="text-lg font-bold font-heading text-foreground">
                  1. Identity &amp; Gender
                </h2>
              </div>

              <div className="space-y-5">
                <div>
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
                    placeholder="Your agency handle or name"
                    className="w-full px-4 py-2.5 rounded-m3-md bg-surface-container text-foreground border border-outline/40 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm font-body"
                  />
                  <p className="text-[11px] text-surface-foreground/60 mt-1 font-body">
                    Pre-filled from your username — you can keep it or personalize it for your staff
                    pass.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-surface-foreground/80 mb-2 font-heading">
                    Gender
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {GENDER_OPTIONS.map((opt) => {
                      const active = genderPresentation === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleGenderChange(opt.value)}
                          className={`py-3 px-4 rounded-m3-md border text-sm font-heading font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                            active
                              ? 'border-primary bg-primary text-primary-foreground shadow-elevation-2'
                              : 'border-outline/40 bg-surface-container text-foreground hover:border-primary/60'
                          }`}
                        >
                          {active && <Check className="w-4 h-4" />}
                          <span>{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Skin Tone Swatches */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-surface-foreground/80 font-heading">
                      Skin Tone
                    </label>
                    <span className="text-xs font-medium text-primary font-body">
                      {SKIN_TONE_OPTIONS.find((s) => s.value === skinTone)?.label}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                    {SKIN_TONE_OPTIONS.map((tone) => {
                      const active = skinTone === tone.value;
                      return (
                        <button
                          key={tone.value}
                          type="button"
                          onClick={() => setSkinTone(tone.value)}
                          className={`flex flex-col items-center gap-1.5 p-2 rounded-m3-md border transition-all cursor-pointer ${
                            active
                              ? 'border-primary bg-primary/10 shadow-elevation-1'
                              : 'border-outline/30 bg-surface-container/60 hover:border-outline'
                          }`}
                        >
                          <span
                            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                              active ? 'border-primary scale-110' : 'border-brand-white/60'
                            }`}
                            style={{ backgroundColor: tone.hex }}
                          >
                            {active && <Check className="w-4 h-4 text-brand-white drop-shadow" />}
                          </span>
                          <span className="text-[10px] font-medium text-foreground/85 text-center leading-tight">
                            {tone.label.split(' ')[0]}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Card>

            {/* 2. Haircut, Outfit, Colour & Accessories */}
            <Card
              variant="elevated"
              elevation="elevation-2"
              className="border border-brand-white/15 bg-surface/95 backdrop-blur-md space-y-6"
            >
              {/* Gender-Adaptive Haircuts */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <Scissors className="w-4 h-4 text-primary" />
                    <h2 className="text-lg font-bold font-heading text-foreground">
                      2. Haircut &amp; Styling
                    </h2>
                  </div>
                  <Badge variant="info" size="sm" className="capitalize">
                    {genderPresentation} Cuts
                  </Badge>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {genderHairstyles.map((cut) => {
                    const active = hairstyle === cut.value;
                    return (
                      <button
                        key={cut.value}
                        type="button"
                        onClick={() => setHairstyle(cut.value)}
                        className={`px-3 py-2.5 rounded-m3-md border text-xs font-semibold font-heading transition-all text-left flex items-center justify-between gap-2 cursor-pointer ${
                          active
                            ? 'border-primary bg-primary/10 text-primary shadow-elevation-1'
                            : 'border-outline/30 bg-surface-container/60 text-foreground hover:border-primary/50'
                        }`}
                      >
                        <span>{cut.label}</span>
                        {active && <Check className="w-3.5 h-3.5 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Outfit Selection (Gender-Adaptive Descriptions) */}
              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <Shirt className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-bold uppercase tracking-wider font-heading text-foreground">
                    Outfit Style
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {OUTFIT_OPTIONS.map((outfit) => {
                    const active = outfitKey === outfit.value;
                    const desc =
                      genderPresentation === 'female' ? outfit.femaleDesc : outfit.maleDesc;
                    return (
                      <button
                        key={outfit.value}
                        type="button"
                        onClick={() => setOutfitKey(outfit.value)}
                        className={`p-3.5 rounded-m3-md border text-left transition-all cursor-pointer ${
                          active
                            ? 'border-primary bg-primary/10 shadow-elevation-1'
                            : 'border-outline/30 bg-surface-container/60 hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-bold font-heading text-foreground">
                            {outfit.label}
                          </span>
                          {active && <Check className="w-4 h-4 text-primary" />}
                        </div>
                        <p className="text-[11px] text-surface-foreground/75 mt-1 font-body leading-snug">
                          {desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Outfit Colour Swatches */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-primary" />
                    <h3 className="text-sm font-bold uppercase tracking-wider font-heading text-foreground">
                      Outfit Colour
                    </h3>
                  </div>
                  <span className="text-xs font-medium text-primary font-body">
                    {OUTFIT_COLOR_OPTIONS.find((c) => c.value === outfitColor)?.label}
                  </span>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {OUTFIT_COLOR_OPTIONS.map((color) => {
                    const active = outfitColor === color.value;
                    return (
                      <button
                        key={color.value}
                        type="button"
                        title={color.label}
                        onClick={() => setOutfitColor(color.value)}
                        className={`flex flex-col items-center gap-1 p-1.5 rounded-m3-md border transition-all cursor-pointer ${
                          active
                            ? 'border-primary bg-primary/10 shadow-elevation-1'
                            : 'border-outline/25 bg-surface-container/40 hover:border-outline'
                        }`}
                      >
                        <span
                          className={`w-7 h-7 rounded-full border-2 flex items-center justify-center ${
                            active ? 'border-primary scale-110' : 'border-outline/30'
                          }`}
                          style={{ backgroundColor: color.hex }}
                        >
                          {active && (
                            <Check
                              className={`w-3.5 h-3.5 ${
                                color.value === 'crisp_ivory'
                                  ? 'text-brand-charcoal'
                                  : 'text-brand-white'
                              }`}
                            />
                          )}
                        </span>
                        <span className="text-[10px] font-medium text-foreground/80 truncate w-full text-center">
                          {color.label.split(' ')[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Accessories Multi-Select */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <h3 className="text-sm font-bold uppercase tracking-wider font-heading text-foreground">
                    Accessories
                  </h3>
                  <span className="text-[11px] text-surface-foreground/60 font-body">
                    Select as many as you like
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {ACCESSORY_OPTIONS.map((acc) => {
                    const Icon = ACCESSORY_ICON_MAP[acc.value];
                    const active = accessories.includes(acc.value);
                    return (
                      <button
                        key={acc.value}
                        type="button"
                        onClick={() => toggleAccessory(acc.value)}
                        className={`px-3 py-2.5 rounded-m3-md border text-xs font-semibold font-heading transition-all flex items-center justify-center gap-2 cursor-pointer ${
                          active
                            ? 'border-primary bg-primary text-primary-foreground shadow-elevation-1'
                            : 'border-outline/35 bg-surface-container/60 text-foreground hover:border-primary/60'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{acc.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </Card>

            {/* 3. Career Track Selection */}
            <Card
              variant="elevated"
              elevation="elevation-2"
              className="border border-brand-white/15 bg-surface/95 backdrop-blur-md"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold font-heading text-foreground">
                  3. Choose Your Career Track
                </h2>
                <Badge variant="info" size="sm">
                  Entry Level (Level 1)
                </Badge>
              </div>
              <div className="space-y-3">
                {tracks.map((track) => (
                  <label
                    key={track.code}
                    className={`flex items-start gap-3 p-4 rounded-m3-md border cursor-pointer transition-all ${
                      careerTrackCode === track.code
                        ? 'border-primary bg-primary/10 shadow-elevation-1'
                        : 'border-outline/30 hover:border-outline bg-surface-container/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="careerTrackCode"
                      value={track.code}
                      checked={careerTrackCode === track.code}
                      onChange={(e) => setCareerTrackCode(e.target.value)}
                      className="mt-1 accent-primary"
                    />
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-sm font-bold font-heading text-foreground">
                          {track.name}
                        </span>
                        {track.entryRole && (
                          <Badge variant="default" size="sm">
                            {track.entryRole.title} · ₦
                            {track.entryRole.salaryBand.minSalary.toLocaleString()}–₦
                            {track.entryRole.salaryBand.maxSalary.toLocaleString()}/mo
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-surface-foreground/75 mt-1 font-body">
                        {track.description}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
              <p className="text-[11px] text-surface-foreground/55 mt-3 font-body">
                * Displayed salary bands are provisional fictional game values for simulation
                gameplay.
              </p>
            </Card>

            {/* 4. Business Unit Placement */}
            <Card
              variant="elevated"
              elevation="elevation-2"
              className="border border-brand-white/15 bg-surface/95 backdrop-blur-md"
            >
              <h2 className="text-lg font-bold font-heading mb-4 text-foreground">
                4. Business Unit Placement
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {units.map((unit) => (
                  <label
                    key={unit.code}
                    className={`p-4 rounded-m3-md border cursor-pointer transition-all ${
                      organisationUnitCode === unit.code
                        ? 'border-primary bg-primary/10 shadow-elevation-1'
                        : 'border-outline/30 hover:border-outline bg-surface-container/50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <input
                        type="radio"
                        name="organisationUnitCode"
                        value={unit.code}
                        checked={organisationUnitCode === unit.code}
                        onChange={(e) => setOrganisationUnitCode(e.target.value)}
                        className="accent-primary"
                      />
                      <span className="text-sm font-bold font-heading text-foreground">
                        {unit.code}
                      </span>
                    </div>
                    <div className="text-xs font-medium text-foreground/90">{unit.name}</div>
                    <p className="text-[11px] text-surface-foreground/70 mt-1 font-body">
                      {unit.description}
                    </p>
                  </label>
                ))}
              </div>
            </Card>

            <Button
              type="submit"
              variant="primary-gradient"
              size="lg"
              disabled={submitting}
              className="w-full py-4 text-base shadow-elevation-3"
            >
              {submitting ? 'Confirming Recruitment...' : 'Complete Onboarding & Join X3M Ideas'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
