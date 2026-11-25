import { prisma } from '@/lib/prisma';
import { CareerEventType, EmploymentStatus, OrganisationUnitType } from '@prisma/client';

export interface AuthUserIdentity {
  id: string;
  email?: string | null;
  fullName?: string | null;
  username?: string | null;
}

const USERNAME_PATTERN = /^[a-z0-9_]{3,30}$/;

export function normalizeUsername(raw?: string | null): string | null {
  if (!raw) return null;
  const cleaned = raw.trim().replace(/^@+/, '').toLowerCase();
  return USERNAME_PATTERN.test(cleaned) ? cleaned : null;
}

export function extractAuthIdentity(user: {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, unknown> | null;
}): AuthUserIdentity {
  const meta = user.user_metadata ?? {};
  const rawFullName = typeof meta.full_name === 'string' ? meta.full_name.trim() : null;
  const rawUsername = typeof meta.username === 'string' ? meta.username : null;
  return {
    id: user.id,
    email: user.email ?? null,
    fullName: rawFullName && rawFullName.length >= 2 ? rawFullName.slice(0, 120) : null,
    username: normalizeUsername(rawUsername)
  };
}

export interface CompleteOnboardingInput {
  displayName: string;
  genderPresentation: string;
  skinTone: string;
  hairstyle: string;
  outfitKey: string;
  outfitColor?: string;
  accessories?: string[];
  careerTrackCode: string;
  organisationUnitCode?: string;
}

/**
 * Server-Authoritative Player & Onboarding Service (Phase 1 / Phase 2 Auth & Onboarding)
 *
 * Security Invariants:
 * - Always resolves player ownership via verified Supabase Auth `user.id` -> `players.supabase_auth_id`.
 * - Never trusts client-submitted playerId, salary, role level, or employment status.
 * - All onboarding writes execute atomically inside a single `prisma.$transaction`.
 */
export class PlayerService {
  /**
   * Fetch a player's full Phase 1 record by verified Supabase Auth user ID.
   */
  public static async getPlayerByAuthId(supabaseAuthId: string) {
    return await prisma.player.findUnique({
      where: { supabaseAuthId },
      include: {
        profile: true,
        employees: {
          where: { isCurrent: true },
          take: 1,
          include: {
            organisationUnit: true,
            jobRole: {
              include: {
                careerTrack: true,
                salaryBand: true
              }
            },
            careerHistories: {
              orderBy: { effectiveAt: 'desc' }
            }
          }
        }
      }
    });
  }

  /**
   * Check whether a requested username is valid and not yet taken (case-insensitive).
   */
  public static async isUsernameAvailable(rawUsername: string): Promise<{
    available: boolean;
    normalized: string | null;
    reason?: string;
  }> {
    const normalized = normalizeUsername(rawUsername);
    if (!normalized) {
      return {
        available: false,
        normalized: null,
        reason: 'Username must be 3–30 characters using only letters, numbers, and underscores.'
      };
    }

    const existing = await prisma.player.findFirst({
      where: {
        username: {
          equals: normalized,
          mode: 'insensitive'
        }
      },
      select: { id: true }
    });

    if (existing) {
      return {
        available: false,
        normalized,
        reason: 'That username is already taken. Please choose another.'
      };
    }

    return { available: true, normalized };
  }

  /**
   * Server-only helper to resolve a player's email snapshot from a username for login.
   * Never expose the returned email to unauthenticated clients.
   */
  public static async findEmailByUsername(rawUsername: string): Promise<string | null> {
    const normalized = normalizeUsername(rawUsername);
    if (!normalized) return null;

    const player = await prisma.player.findFirst({
      where: {
        username: {
          equals: normalized,
          mode: 'insensitive'
        }
      },
      select: { emailSnapshot: true }
    });

    return player?.emailSnapshot ?? null;
  }

  /**
   * Ensure a base `Player` record exists and return the full hydrated player record
   * in a single database round-trip.
   */
  public static async ensureAndGetPlayer(authUser: AuthUserIdentity) {
    const normalizedUsername = normalizeUsername(authUser.username);
    const trimmedName = authUser.fullName?.trim() || null;

    return await prisma.player.upsert({
      where: { supabaseAuthId: authUser.id },
      update: {
        emailSnapshot: authUser.email ?? undefined,
        ...(trimmedName ? { fullName: trimmedName } : {}),
        ...(normalizedUsername ? { username: normalizedUsername } : {}),
        lastSeenAt: new Date()
      },
      create: {
        supabaseAuthId: authUser.id,
        fullName: trimmedName,
        username: normalizedUsername,
        emailSnapshot: authUser.email ?? null,
        lastSeenAt: new Date()
      },
      include: {
        profile: true,
        employees: {
          where: { isCurrent: true },
          take: 1,
          include: {
            organisationUnit: true,
            jobRole: {
              include: {
                careerTrack: true,
                salaryBand: true
              }
            },
            careerHistories: {
              orderBy: { effectiveAt: 'desc' }
            }
          }
        }
      }
    });
  }

  /**
   * Ensure a base `Player` record exists for an authenticated Supabase user.
   * Updates `lastSeenAt` and `emailSnapshot` (non-authoritative cache).
   */
  public static async ensurePlayerRecord(authUser: AuthUserIdentity) {
    return await prisma.player.upsert({
      where: { supabaseAuthId: authUser.id },
      update: {
        emailSnapshot: authUser.email ?? undefined,
        lastSeenAt: new Date()
      },
      create: {
        supabaseAuthId: authUser.id,
        emailSnapshot: authUser.email ?? null,
        lastSeenAt: new Date()
      }
    });
  }

  /**
   * Load configurable onboarding options directly from PostgreSQL (no hardcoded titles or salary bands).
   */
  public static async getOnboardingOptions() {
    const [tracks, businessUnits] = await Promise.all([
      prisma.careerTrack.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' },
        include: {
          jobRoles: {
            where: { level: 1 },
            include: { salaryBand: true },
            take: 1
          }
        }
      }),
      prisma.organisationUnit.findMany({
        where: {
          isActive: true,
          unitType: OrganisationUnitType.BUSINESS_UNIT
        },
        orderBy: { code: 'asc' }
      })
    ]);

    return {
      careerTracks: tracks.map((t) => ({
        code: t.code,
        name: t.name,
        description: t.description,
        entryRole: t.jobRoles[0]
          ? {
              title: t.jobRoles[0].title,
              level: t.jobRoles[0].level,
              description: t.jobRoles[0].description,
              salaryBand: {
                minSalary: t.jobRoles[0].salaryBand.minSalary,
                maxSalary: t.jobRoles[0].salaryBand.maxSalary,
                currency: t.jobRoles[0].salaryBand.currency
              }
            }
          : null
      })),
      businessUnits: businessUnits.map((u) => ({
        code: u.code,
        name: u.name,
        description: u.description
      }))
    };
  }

  /**
   * Complete character creation & entry-level recruitment atomically.
   * Creates Player (if needed), PlayerProfile, Level-1 Employee, and initial HIRED CareerHistory.
   */
  public static async completeOnboarding(
    authUser: AuthUserIdentity,
    input: CompleteOnboardingInput
  ) {
    return await prisma.$transaction(async (tx) => {
      // 1. Ensure Player row
      const normalizedUsername = normalizeUsername(authUser.username);
      const trimmedName = authUser.fullName?.trim() || null;

      const player = await tx.player.upsert({
        where: { supabaseAuthId: authUser.id },
        update: {
          emailSnapshot: authUser.email ?? undefined,
          ...(trimmedName ? { fullName: trimmedName } : {}),
          ...(normalizedUsername ? { username: normalizedUsername } : {}),
          lastSeenAt: new Date()
        },
        create: {
          supabaseAuthId: authUser.id,
          fullName: trimmedName,
          username: normalizedUsername,
          emailSnapshot: authUser.email ?? null,
          lastSeenAt: new Date()
        },
        include: {
          profile: true,
          employees: { where: { isCurrent: true } }
        }
      });

      if (player.profile && player.employees.length > 0) {
        throw new Error('Player onboarding has already been completed.');
      }

      // 2. Resolve selected Career Track & its Level-1 Entry Role (with fictional Salary Band)
      const track = await tx.careerTrack.findUnique({
        where: { code: input.careerTrackCode, isActive: true }
      });
      if (!track) {
        throw new Error(`Invalid or inactive career track: ${input.careerTrackCode}`);
      }

      const entryRole = await tx.jobRole.findUnique({
        where: {
          careerTrackId_level: {
            careerTrackId: track.id,
            level: 1
          }
        },
        include: { salaryBand: true }
      });
      if (!entryRole) {
        throw new Error(`Entry-level role not configured for track: ${track.code}`);
      }

      // 3. Resolve Business Unit (BU1, BU2, or BU3)
      const requestedUnitCode = input.organisationUnitCode || 'BU1';
      const orgUnit = await tx.organisationUnit.findFirst({
        where: {
          code: requestedUnitCode,
          isActive: true,
          unitType: OrganisationUnitType.BUSINESS_UNIT
        }
      });
      if (!orgUnit) {
        throw new Error(`Invalid business unit assignment: ${requestedUnitCode}`);
      }

      // 4. Create PlayerProfile (if not already present)
      const profile = player.profile
        ? player.profile
        : await tx.playerProfile.create({
            data: {
              playerId: player.id,
              displayName: input.displayName.trim(),
              genderPresentation: input.genderPresentation,
              avatarModelKey: 'player-character',
              skinTone: input.skinTone,
              hairstyle: input.hairstyle,
              outfitKey: input.outfitKey,
              outfitColor: input.outfitColor ?? 'x3m_crimson',
              accessories: input.accessories ?? []
            }
          });

      // 5. Create Entry-Level Employee spell (always starts at Level 1 min fictional salary)
      const startingSalary = entryRole.salaryBand.minSalary;
      const employee = await tx.employee.create({
        data: {
          playerId: player.id,
          organisationUnitId: orgUnit.id,
          careerTrackId: track.id,
          jobRoleId: entryRole.id,
          currentSalary: startingSalary,
          status: EmploymentStatus.PROBATION,
          isCurrent: true,
          hiredGameDay: 1
        },
        include: {
          organisationUnit: true,
          jobRole: {
            include: {
              careerTrack: true,
              salaryBand: true
            }
          }
        }
      });

      // 6. Append initial HIRED CareerHistory snapshot
      const historyEntry = await tx.careerHistory.create({
        data: {
          employeeId: employee.id,
          eventType: CareerEventType.HIRED,
          roleTitleSnapshot: entryRole.title,
          levelSnapshot: entryRole.level,
          unitNameSnapshot: orgUnit.name,
          salarySnapshot: startingSalary,
          effectiveGameDay: 1,
          notes: `Joined X3M Ideas as ${entryRole.title} in ${orgUnit.name}.`
        }
      });

      return {
        player: {
          id: player.id,
          supabaseAuthId: player.supabaseAuthId,
          status: player.status
        },
        profile,
        employee,
        historyEntry
      };
    });
  }
}

