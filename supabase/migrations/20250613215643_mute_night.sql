/*
  # Clean Music Tracks Setup

  1. Database Changes
    - Remove the fake "$DOWNLOAD" track
    - Add cover_image_url column for custom artwork
    - Insert/update the 3 real tracks with correct Stripe Price IDs
    - Set all tracks to $0.99 pricing

  2. Track Configuration
    - Heavenly Vibin → price_1RZeCfGKbDbFMYBRBxzujgeH
    - Gospel In Ya Face → price_1RZeElGKbDbFMYBRnGx0Loq3  
    - Let My People Go → placeholder (to be updated)

  3. Security
    - Maintain existing RLS policies
    - Keep performance indexes
*/

-- Remove the fake $DOWNLOAD track
DELETE FROM music_tracks WHERE title = '$DOWNLOAD';

-- Add cover_image_url column for custom artwork
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'music_tracks' AND column_name = 'cover_image_url'
  ) THEN
    ALTER TABLE music_tracks ADD COLUMN cover_image_url text;
  END IF;
END $$;

-- Ensure stripe_price_id column exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'music_tracks' AND column_name = 'stripe_price_id'
  ) THEN
    ALTER TABLE music_tracks ADD COLUMN stripe_price_id text;
  END IF;
END $$;

-- Clear existing tracks and insert the 3 real tracks
DELETE FROM music_tracks;

-- Insert the 3 real music tracks
INSERT INTO music_tracks (
  title,
  artist,
  description,
  price_cents,
  stripe_price_id,
  cover_image_url,
  created_at,
  updated_at
) VALUES 
(
  'Heavenly Vibin',
  'DLD',
  'Uplifting Kingdom music that connects your spirit to divine frequencies',
  99, -- $0.99 in cents
  'price_1RZeCfGKbDbFMYBRBxzujgeH',
  NULL, -- Will be updated when custom artwork is uploaded
  now(),
  now()
),
(
  'Gospel In Ya Face',
  'DLD',
  'Bold, unapologetic gospel truth delivered with power and conviction',
  99, -- $0.99 in cents
  'price_1RZeElGKbDbFMYBRnGx0Loq3',
  NULL, -- Will be updated when custom artwork is uploaded
  now(),
  now()
),
(
  'Let My People Go',
  'DLD',
  'A modern exodus anthem calling for spiritual freedom and deliverance',
  99, -- $0.99 in cents
  NULL, -- Placeholder - to be updated when Stripe Price ID is ready
  NULL, -- Will be updated when custom artwork is uploaded
  now(),
  now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_music_tracks_stripe_price_id ON music_tracks(stripe_price_id);
CREATE INDEX IF NOT EXISTS idx_music_tracks_cover_image_url ON music_tracks(cover_image_url);