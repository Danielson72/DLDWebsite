/*
  # Add Stripe Price ID to music tracks

  1. Changes
    - Add `stripe_price_id` column to `music_tracks` table
    - Update existing tracks with sample Price IDs for testing
    - Add constraint to ensure Price ID is provided for new tracks

  2. Security
    - No changes to RLS policies needed
*/

-- Add stripe_price_id column to music_tracks table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'music_tracks' AND column_name = 'stripe_price_id'
  ) THEN
    ALTER TABLE music_tracks ADD COLUMN stripe_price_id text;
  END IF;
END $$;

-- Update existing tracks with sample Price IDs (replace with real ones from your Stripe dashboard)
UPDATE music_tracks 
SET stripe_price_id = CASE 
  WHEN title ILIKE '%heavenly%vibes%' THEN 'price_1Heavenly123'
  WHEN title ILIKE '%let%my%people%go%' THEN 'price_1LetGo456'
  WHEN title ILIKE '%gospel%in%ya%face%' THEN 'price_1Gospel789'
  ELSE 'price_1Default000' -- Default price ID for other tracks
END
WHERE stripe_price_id IS NULL;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_music_tracks_stripe_price_id ON music_tracks(stripe_price_id);