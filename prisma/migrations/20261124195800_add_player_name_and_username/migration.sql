-- Add full_name and username columns to players for unified Auth registration
ALTER TABLE "players"
  ADD COLUMN "full_name" VARCHAR(120),
  ADD COLUMN "username" VARCHAR(40);

-- Unique index matching Prisma @unique + case-insensitive uniqueness guard
CREATE UNIQUE INDEX "players_username_key" ON "players" ("username");
CREATE UNIQUE INDEX "uq_players_username_lower" ON "players" (LOWER("username")) WHERE "username" IS NOT NULL;

