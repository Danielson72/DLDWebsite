/*
  # Fix Storage Configuration

  Since storage policies cannot be created via regular migrations due to permission restrictions,
  this migration focuses on ensuring the music_tracks table is properly configured.
  
  Storage policies should be configured through the Supabase Dashboard:
  1. Go to Storage → Policies
  2. Create policies for the 'music' bucket
  3. Set appropriate permissions for authenticated users
*/

-- Ensure the music_tracks table has all necessary columns and constraints
DO $$
BEGIN
  -- Ensure stripe_price_id column exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'music_tracks' AND column_name = 'stripe_price_id'
  ) THEN
    ALTER TABLE music_tracks ADD COLUMN stripe_price_id text;
  END IF;

  -- Ensure is_active column exists with default true
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'music_tracks' AND column_name = 'is_active'
  ) THEN
    ALTER TABLE music_tracks ADD COLUMN is_active boolean DEFAULT true;
  END IF;

  -- Ensure cover_image_url column exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'music_tracks' AND column_name = 'cover_image_url'
  ) THEN
    ALTER TABLE music_tracks ADD COLUMN cover_image_url text;
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_music_tracks_stripe_price_id ON music_tracks(stripe_price_id);
CREATE INDEX IF NOT EXISTS idx_music_tracks_is_active ON music_tracks(is_active);
CREATE INDEX IF NOT EXISTS idx_music_tracks_cover_image_url ON music_tracks(cover_image_url);

-- Update any existing tracks to be active by default
UPDATE music_tracks SET is_active = true WHERE is_active IS NULL;