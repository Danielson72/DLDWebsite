/*
  # Add $DOWNLOAD track with Stripe Price ID

  1. New Track
    - Add "$DOWNLOAD" track with the specified Stripe Price ID
    - Set appropriate metadata and pricing
  
  2. Updates
    - Ensure stripe_price_id column exists
    - Add the track with proper artist and pricing information
*/

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

-- Insert the $DOWNLOAD track with the specified Stripe Price ID
INSERT INTO music_tracks (
  title,
  artist,
  description,
  price_cents,
  stripe_price_id,
  audio_full,
  audio_preview,
  cover_url,
  created_at,
  updated_at
) VALUES (
  '$DOWNLOAD',
  'DLD',
  'Premium digital download - High quality audio track from Daniel in the Lion''s Den',
  199, -- $1.99 in cents
  'price_1RZeCfGKbDbFMYBRBxzujgeH',
  'https://example.com/placeholder-audio.mp3', -- Replace with actual audio URL
  'https://example.com/placeholder-preview.mp3', -- Replace with actual preview URL
  'https://example.com/placeholder-cover.jpg', -- Replace with actual cover URL
  now(),
  now()
) ON CONFLICT (title, artist) DO UPDATE SET
  stripe_price_id = EXCLUDED.stripe_price_id,
  price_cents = EXCLUDED.price_cents,
  description = EXCLUDED.description,
  updated_at = now();

-- Create index for stripe_price_id if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_music_tracks_stripe_price_id ON music_tracks(stripe_price_id);