-- Add outfit_color and accessories to player_profiles for rich character customization
ALTER TABLE "player_profiles"
  ADD COLUMN "outfit_color" VARCHAR(32) NOT NULL DEFAULT 'x3m_crimson',
  ADD COLUMN "accessories" JSONB NOT NULL DEFAULT '[]'::jsonb;

