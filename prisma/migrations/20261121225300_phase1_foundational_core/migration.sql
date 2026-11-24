-- ==============================================================================
-- X3M Ideas: Agency Life Simulation — Phase 1: Foundational Core Migration
-- ==============================================================================

-- CreateEnum
CREATE TYPE "PlayerStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "OrganisationUnitType" AS ENUM ('BUSINESS_UNIT', 'FUNCTIONAL_DEPARTMENT');

-- CreateEnum
CREATE TYPE "EmploymentStatus" AS ENUM ('ONBOARDING', 'PROBATION', 'ACTIVE', 'WARNING_REVIEW', 'ON_LEAVE', 'TERMINATED', 'RESIGNED');

-- CreateEnum
CREATE TYPE "CareerEventType" AS ENUM ('HIRED', 'PROMOTED', 'TRANSFERRED', 'SALARY_ADJUSTED', 'TERMINATED', 'REHIRED');

-- CreateTable
CREATE TABLE "players" (
    "id" UUID NOT NULL,
    "supabase_auth_id" UUID NOT NULL,
    "email_snapshot" VARCHAR(255),
    "status" "PlayerStatus" NOT NULL DEFAULT 'ACTIVE',
    "last_seen_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "archived_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "players_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "player_profiles" (
    "id" UUID NOT NULL,
    "player_id" UUID NOT NULL,
    "display_name" VARCHAR(80) NOT NULL,
    "gender_presentation" VARCHAR(32) NOT NULL DEFAULT 'unspecified',
    "avatar_model_key" VARCHAR(64) NOT NULL DEFAULT 'player-character',
    "skin_tone" VARCHAR(32) NOT NULL DEFAULT 'default',
    "hairstyle" VARCHAR(64) NOT NULL DEFAULT 'default',
    "outfit_key" VARCHAR(64) NOT NULL DEFAULT 'business_casual',
    "avatar_thumbnail_url" TEXT,
    "absence_protection_until" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "player_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organisation_units" (
    "id" UUID NOT NULL,
    "code" VARCHAR(24) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "unit_type" "OrganisationUnitType" NOT NULL,
    "description" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "organisation_units_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "career_tracks" (
    "id" UUID NOT NULL,
    "code" VARCHAR(32) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "career_tracks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "salary_bands" (
    "id" UUID NOT NULL,
    "code" VARCHAR(32) NOT NULL,
    "label" VARCHAR(100) NOT NULL,
    "min_salary" INTEGER NOT NULL,
    "max_salary" INTEGER NOT NULL,
    "currency" VARCHAR(8) NOT NULL DEFAULT 'NGN',
    "effective_from" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "salary_bands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_roles" (
    "id" UUID NOT NULL,
    "career_track_id" UUID NOT NULL,
    "level" INTEGER NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,
    "salary_band_id" UUID NOT NULL,
    "promotion_criteria" JSONB,

    CONSTRAINT "job_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employees" (
    "id" UUID NOT NULL,
    "player_id" UUID NOT NULL,
    "organisation_unit_id" UUID NOT NULL,
    "career_track_id" UUID NOT NULL,
    "job_role_id" UUID NOT NULL,
    "current_salary" INTEGER NOT NULL,
    "performance_score" DOUBLE PRECISION NOT NULL DEFAULT 70.0,
    "experience_points" INTEGER NOT NULL DEFAULT 0,
    "warning_count" INTEGER NOT NULL DEFAULT 0,
    "status" "EmploymentStatus" NOT NULL DEFAULT 'PROBATION',
    "is_current" BOOLEAN NOT NULL DEFAULT true,
    "hired_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hired_game_day" INTEGER NOT NULL DEFAULT 1,
    "terminated_at" TIMESTAMPTZ,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "career_histories" (
    "id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "event_type" "CareerEventType" NOT NULL,
    "role_title_snapshot" VARCHAR(100) NOT NULL,
    "level_snapshot" INTEGER NOT NULL,
    "unit_name_snapshot" VARCHAR(100) NOT NULL,
    "salary_snapshot" INTEGER NOT NULL,
    "notes" TEXT,
    "effective_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "effective_game_day" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "career_histories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "players_supabase_auth_id_key" ON "players"("supabase_auth_id");

-- CreateIndex
CREATE UNIQUE INDEX "player_profiles_player_id_key" ON "player_profiles"("player_id");

-- CreateIndex
CREATE UNIQUE INDEX "organisation_units_code_key" ON "organisation_units"("code");

-- CreateIndex
CREATE UNIQUE INDEX "career_tracks_code_key" ON "career_tracks"("code");

-- CreateIndex
CREATE UNIQUE INDEX "salary_bands_code_key" ON "salary_bands"("code");

-- CreateIndex
CREATE UNIQUE INDEX "job_roles_career_track_id_level_key" ON "job_roles"("career_track_id", "level");

-- CreateIndex
CREATE UNIQUE INDEX "job_roles_career_track_id_id_key" ON "job_roles"("career_track_id", "id");

-- CreateIndex
CREATE INDEX "employees_player_id_is_current_idx" ON "employees"("player_id", "is_current");

-- CreateIndex
CREATE INDEX "employees_organisation_unit_id_status_idx" ON "employees"("organisation_unit_id", "status");

-- CreateIndex
CREATE INDEX "career_histories_employee_id_effective_at_idx" ON "career_histories"("employee_id", "effective_at" DESC);

-- Partial Unique Index: Enforce at most one current employment spell per player
CREATE UNIQUE INDEX "uq_employees_one_current_per_player"
    ON "employees"("player_id")
    WHERE "is_current" = true;

-- AddForeignKey (All ON DELETE RESTRICT to protect historical/player data)
ALTER TABLE "player_profiles" ADD CONSTRAINT "player_profiles_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "job_roles" ADD CONSTRAINT "job_roles_career_track_id_fkey" FOREIGN KEY ("career_track_id") REFERENCES "career_tracks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "job_roles" ADD CONSTRAINT "job_roles_salary_band_id_fkey" FOREIGN KEY ("salary_band_id") REFERENCES "salary_bands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "employees" ADD CONSTRAINT "employees_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "employees" ADD CONSTRAINT "employees_organisation_unit_id_fkey" FOREIGN KEY ("organisation_unit_id") REFERENCES "organisation_units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "employees" ADD CONSTRAINT "employees_career_track_id_job_role_id_fkey" FOREIGN KEY ("career_track_id", "job_role_id") REFERENCES "job_roles"("career_track_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "career_histories" ADD CONSTRAINT "career_histories_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Check Constraints
ALTER TABLE "salary_bands"
    ADD CONSTRAINT "chk_salary_bands_valid_range"
    CHECK ("min_salary" >= 0 AND "max_salary" >= "min_salary");

ALTER TABLE "job_roles"
    ADD CONSTRAINT "chk_job_roles_valid_level"
    CHECK ("level" >= 1);

ALTER TABLE "employees"
    ADD CONSTRAINT "chk_employees_valid_metrics"
    CHECK (
        "current_salary" >= 0
        AND "performance_score" >= 0
        AND "performance_score" <= 100
        AND "experience_points" >= 0
        AND "warning_count" >= 0
    );

ALTER TABLE "career_histories"
    ADD CONSTRAINT "chk_career_histories_valid_snapshots"
    CHECK ("level_snapshot" >= 1 AND "salary_snapshot" >= 0);

-- ==============================================================================
-- Supabase Row Level Security (Strict Server-Only Mode)
-- Enabling RLS with no permissive policies for anon/authenticated denies all
-- direct browser PostgREST reads and writes. All gameplay data is routed
-- through server-authoritative Next.js services using Prisma.
-- ==============================================================================
ALTER TABLE "players" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "player_profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "organisation_units" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "career_tracks" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "salary_bands" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "job_roles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "employees" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "career_histories" ENABLE ROW LEVEL SECURITY;

