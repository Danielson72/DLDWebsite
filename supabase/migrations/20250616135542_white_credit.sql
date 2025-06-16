/*
  # Add Stripe Price ID and Insert $DOWNLOAD Track

  1. Schema Changes
    - Add `stripe_price_id` column to `music_tracks` table if it doesn't exist
    - Create index on `stripe_price_id` for performance

  2. Data Changes
    - Insert or update the $DOWNLOAD track with Stripe Price ID
    - Set price to $1.99 (199 cents)
    - Add placeholder URLs for audio and cover (to be updated later)

  3. Performance
    - Add index on `stripe_price_id` column for faster lookups
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

-- Check if the $DOWNLOAD track already exists and update or insert accordingly
DO $$
BEGIN
  -- First, try to update existing record
  UPDATE music_tracks 
  SET 
    stripe_price_id = 'price_1RZeCfGKbDbFMYBRBxzujgeH',
    price_cents = 199,
    description = 'Premium digital download - High quality audio track from Daniel in the Lion''s Den',
    updated_at = now()
  WHERE title = '$DOWNLOAD' AND artist = 'DLD';
  
  -- If no rows were updated, insert the new record
  IF NOT FOUND THEN
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
    );
  END IF;
END $$;

-- Create index for stripe_price_id if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_music_tracks_stripe_price_id ON music_tracks(stripe_price_id);