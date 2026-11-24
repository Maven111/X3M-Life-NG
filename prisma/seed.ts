/**
 * X3M Ideas: Agency Life Simulation — Phase 1 Foundational Seed Script
 *
 * Seeds:
 *   - 5 Organisation Units (BU1, BU2, BU3, Finance, HR)
 *   - 5 Career Tracks (Copywriting, Art Direction, Brand Strategy, Digital Strategy, Brand Management)
 *   - 5 Provisional Fictional Game Salary Bands (Whole Naira INTEGER, average Nigerian agency ranges;
 *     explicitly fictional game values — NOT actual X3M Ideas employee salaries)
 *   - 25 Provisional Track-Specific Job Roles (5 levels per track, including Deputy Creative Director)
 *
 * Idempotent: Safe to run multiple times using Prisma upserts on unique keys.
 * Run with: node --env-file=.env.local prisma/seed.ts
 */

import { PrismaClient, OrganisationUnitType } from '@prisma/client';

const prisma = new PrismaClient();

const ORGANISATION_UNITS = [
  {
    code: 'BU1',
    name: 'Business Unit 1',
    unitType: OrganisationUnitType.BUSINESS_UNIT,
    description: 'Cross-functional client business unit handling flagship consumer and lifestyle accounts.'
  },
  {
    code: 'BU2',
    name: 'Business Unit 2',
    unitType: OrganisationUnitType.BUSINESS_UNIT,
    description: 'Cross-functional client business unit specialising in telecoms, fintech, and high-growth brands.'
  },
  {
    code: 'BU3',
    name: 'Business Unit 3',
    unitType: OrganisationUnitType.BUSINESS_UNIT,
    description: 'Cross-functional client business unit driving integrated regional and digital-first campaigns.'
  },
  {
    code: 'FINANCE',
    name: 'Finance',
    unitType: OrganisationUnitType.FUNCTIONAL_DEPARTMENT,
    description: 'Agency functional department overseeing virtual payroll, bonuses, budgets, and financial governance.'
  },
  {
    code: 'HR',
    name: 'Human Resources',
    unitType: OrganisationUnitType.FUNCTIONAL_DEPARTMENT,
    description: 'Agency functional department managing recruitment, onboarding, performance reviews, warnings, and promotions.'
  }
];

const CAREER_TRACKS = [
  {
    code: 'COPYWRITING',
    name: 'Copywriting',
    description: 'Craft memorable headlines, campaign concepts, scripts, and brand tone of voice.'
  },
  {
    code: 'ART_DIRECTION',
    name: 'Art Direction',
    description: 'Shape visual direction, creative design systems, storyboards, and campaign aesthetics.'
  },
  {
    code: 'BRAND_STRATEGY',
    name: 'Brand Strategy',
    description: 'Uncover consumer insights, define brand positioning, and guide strategic campaign direction.'
  },
  {
    code: 'DIGITAL_STRATEGY',
    name: 'Digital Strategy',
    description: 'Architect audience targeting, digital channel ecosystems, social campaigns, and performance metrics.'
  },
  {
    code: 'BRAND_MANAGEMENT',
    name: 'Brand Management',
    description: 'Lead client relationships, coordinate cross-functional briefs, timelines, and campaign delivery.'
  }
];

// Clearly labelled provisional fictional game salary bands (Whole Naira INTEGER).
// Derived from approximate average Nigerian advertising industry ranges for gameplay progression.
// NOT actual X3M Ideas employee salaries.
const FICTIONAL_GAME_SALARY_BANDS = [
  {
    code: 'GAME_BAND_L1',
    label: 'Level 1 — Entry Level (Provisional Fictional Game Band)',
    minSalary: 120000,
    maxSalary: 200000,
    currency: 'NGN'
  },
  {
    code: 'GAME_BAND_L2',
    label: 'Level 2 — Junior Specialist (Provisional Fictional Game Band)',
    minSalary: 220000,
    maxSalary: 380000,
    currency: 'NGN'
  },
  {
    code: 'GAME_BAND_L3',
    label: 'Level 3 — Mid-Level / Senior Specialist (Provisional Fictional Game Band)',
    minSalary: 420000,
    maxSalary: 680000,
    currency: 'NGN'
  },
  {
    code: 'GAME_BAND_L4',
    label: 'Level 4 — Manager / Deputy Lead (Provisional Fictional Game Band)',
    minSalary: 750000,
    maxSalary: 1200000,
    currency: 'NGN'
  },
  {
    code: 'GAME_BAND_L5',
    label: 'Level 5 — Director / Group Head (Provisional Fictional Game Band)',
    minSalary: 1350000,
    maxSalary: 2200000,
    currency: 'NGN'
  }
];

const PROMOTION_CRITERIA_BY_LEVEL: Record<number, Record<string, number> | null> = {
  1: { minBriefsCompleted: 3, minAvgScore: 70, minPerformanceScore: 70, minTenureGameDays: 7 },
  2: { minBriefsCompleted: 6, minAvgScore: 75, minPerformanceScore: 75, minTenureGameDays: 14 },
  3: { minBriefsCompleted: 10, minAvgScore: 80, minPerformanceScore: 80, minTenureGameDays: 28 },
  4: { minBriefsCompleted: 15, minAvgScore: 85, minPerformanceScore: 85, minTenureGameDays: 45 },
  5: null
};

// Provisional fictional track-specific designations (5 levels per track).
// Includes Deputy Creative Director in creative tracks per Game Mechanics specification.
const PROVISIONAL_JOB_ROLES: Record<string, Array<{ level: number; title: string; description: string; bandCode: string }>> = {
  COPYWRITING: [
    { level: 1, title: 'Graduate Copywriter', description: 'Entry-level writer supporting social copy, taglines, and creative brainstorms.', bandCode: 'GAME_BAND_L1' },
    { level: 2, title: 'Junior Copywriter', description: 'Writes campaign scripts, digital copy, and brand messaging under creative guidance.', bandCode: 'GAME_BAND_L2' },
    { level: 3, title: 'Senior Copywriter', description: 'Owns big-idea narrative direction and mentors junior writers across integrated campaigns.', bandCode: 'GAME_BAND_L3' },
    { level: 4, title: 'Deputy Creative Director (Copy)', description: 'Leads verbal craft across multiple client accounts and shapes agency pitch narratives.', bandCode: 'GAME_BAND_L4' },
    { level: 5, title: 'Creative Director (Copy)', description: 'Executive creative leader setting the copy and conceptual standard across the agency.', bandCode: 'GAME_BAND_L5' }
  ],
  ART_DIRECTION: [
    { level: 1, title: 'Graduate Art Director', description: 'Entry-level visual creative assisting with moodboards, layouts, and campaign visuals.', bandCode: 'GAME_BAND_L1' },
    { level: 2, title: 'Junior Art Director', description: 'Designs key visuals, digital assets, and storyboards for integrated brand campaigns.', bandCode: 'GAME_BAND_L2' },
    { level: 3, title: 'Senior Art Director', description: 'Directs visual storytelling, shoots, and high-craft design systems for flagship briefs.', bandCode: 'GAME_BAND_L3' },
    { level: 4, title: 'Deputy Creative Director (Art)', description: 'Oversees visual craft across business units and co-leads major creative pitches.', bandCode: 'GAME_BAND_L4' },
    { level: 5, title: 'Creative Director (Art)', description: 'Executive visual leader defining the agency aesthetic and award-winning campaign craft.', bandCode: 'GAME_BAND_L5' }
  ],
  BRAND_STRATEGY: [
    { level: 1, title: 'Graduate Strategy Analyst', description: 'Entry-level planner researching market trends, cultural insights, and audience behaviour.', bandCode: 'GAME_BAND_L1' },
    { level: 2, title: 'Junior Brand Strategist', description: 'Translates consumer research into clear creative briefs and brand positioning frameworks.', bandCode: 'GAME_BAND_L2' },
    { level: 3, title: 'Brand Strategist', description: 'Leads brand architecture, strategic workshops, and campaign insight validation.', bandCode: 'GAME_BAND_L3' },
    { level: 4, title: 'Senior Brand Strategist', description: 'Directs multi-market brand strategy and advises client leadership on growth positioning.', bandCode: 'GAME_BAND_L4' },
    { level: 5, title: 'Strategy Director', description: 'Heads strategic planning across the agency and champions insight-led creative work.', bandCode: 'GAME_BAND_L5' }
  ],
  DIGITAL_STRATEGY: [
    { level: 1, title: 'Graduate Digital Analyst', description: 'Entry-level digital specialist monitoring channel metrics, trends, and campaign performance.', bandCode: 'GAME_BAND_L1' },
    { level: 2, title: 'Junior Digital Strategist', description: 'Plans social, content, and paid digital journeys aligned with campaign objectives.', bandCode: 'GAME_BAND_L2' },
    { level: 3, title: 'Digital Strategist', description: 'Owns full-funnel digital architectures, audience segmentation, and attribution frameworks.', bandCode: 'GAME_BAND_L3' },
    { level: 4, title: 'Digital Strategy Lead', description: 'Leads digital innovation, platform partnerships, and cross-unit digital transformation.', bandCode: 'GAME_BAND_L4' },
    { level: 5, title: 'Head of Digital Strategy', description: 'Executive digital leader steering the agency digital vision and emerging-tech capabilities.', bandCode: 'GAME_BAND_L5' }
  ],
  BRAND_MANAGEMENT: [
    { level: 1, title: 'Graduate Account Executive', description: 'Entry-level client partner coordinating meeting notes, timelines, and brief tracking.', bandCode: 'GAME_BAND_L1' },
    { level: 2, title: 'Junior Brand Manager', description: 'Manages day-to-day client communications and ensures smooth brief handoffs across teams.', bandCode: 'GAME_BAND_L2' },
    { level: 3, title: 'Brand Manager', description: 'Leads account delivery, client presentations, and cross-functional campaign execution.', bandCode: 'GAME_BAND_L3' },
    { level: 4, title: 'Senior Brand Manager', description: 'Owns key client portfolios, commercial growth, and senior stakeholder relationships.', bandCode: 'GAME_BAND_L4' },
    { level: 5, title: 'Group Account Director', description: 'Executive business-unit leader driving client retention, agency growth, and account excellence.', bandCode: 'GAME_BAND_L5' }
  ]
};

async function main() {
  console.log('[Seed] Starting Phase 1 foundational seed...');

  // 1. Seed Organisation Units
  for (const unit of ORGANISATION_UNITS) {
    await prisma.organisationUnit.upsert({
      where: { code: unit.code },
      update: {
        name: unit.name,
        unitType: unit.unitType,
        description: unit.description,
        isActive: true
      },
      create: unit
    });
  }
  console.log(`[Seed] Upserted ${ORGANISATION_UNITS.length} organisation units.`);

  // 2. Seed Career Tracks
  const trackMap = new Map<string, string>();
  for (const track of CAREER_TRACKS) {
    const saved = await prisma.careerTrack.upsert({
      where: { code: track.code },
      update: {
        name: track.name,
        description: track.description,
        isActive: true
      },
      create: track
    });
    trackMap.set(track.code, saved.id);
  }
  console.log(`[Seed] Upserted ${CAREER_TRACKS.length} career tracks.`);

  // 3. Seed Provisional Fictional Game Salary Bands
  const bandMap = new Map<string, string>();
  for (const band of FICTIONAL_GAME_SALARY_BANDS) {
    const saved = await prisma.salaryBand.upsert({
      where: { code: band.code },
      update: {
        label: band.label,
        minSalary: band.minSalary,
        maxSalary: band.maxSalary,
        currency: band.currency
      },
      create: band
    });
    bandMap.set(band.code, saved.id);
  }
  console.log(`[Seed] Upserted ${FICTIONAL_GAME_SALARY_BANDS.length} fictional game salary bands.`);

  // 4. Seed Provisional Track-Specific Job Roles (5 levels x 5 tracks = 25 roles)
  let roleCount = 0;
  for (const [trackCode, roles] of Object.entries(PROVISIONAL_JOB_ROLES)) {
    const careerTrackId = trackMap.get(trackCode);
    if (!careerTrackId) throw new Error(`Missing career track ID for ${trackCode}`);

    for (const role of roles) {
      const salaryBandId = bandMap.get(role.bandCode);
      if (!salaryBandId) throw new Error(`Missing salary band ID for ${role.bandCode}`);

      await prisma.jobRole.upsert({
        where: {
          careerTrackId_level: {
            careerTrackId,
            level: role.level
          }
        },
        update: {
          title: role.title,
          description: role.description,
          salaryBandId,
          promotionCriteria: PROMOTION_CRITERIA_BY_LEVEL[role.level] ?? undefined
        },
        create: {
          careerTrackId,
          level: role.level,
          title: role.title,
          description: role.description,
          salaryBandId,
          promotionCriteria: PROMOTION_CRITERIA_BY_LEVEL[role.level] ?? undefined
        }
      });
      roleCount++;
    }
  }
  console.log(`[Seed] Upserted ${roleCount} provisional job roles.`);
  console.log('[Seed] Phase 1 foundational seed completed successfully.');
}

main()
  .catch((err) => {
    console.error('[Seed] Failed:', err instanceof Error ? err.message : String(err));
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
