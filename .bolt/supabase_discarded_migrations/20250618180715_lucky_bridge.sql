/*
  # Add $DOWNLOAD track with Stripe integration

  1. Database Changes
    - Ensure stripe_price_id column exists on music_tracks table
    - Insert $DOWNLOAD track with Stripe Price ID: price_1RZeCfGKbDbFMYBRBxzujgeH
    - Create index for stripe_price_id for better query performance

  2. Track Details
    - Title: $DOWNLOAD
    - Artist: DLD (Daniel in the Lion's Den)
    - Price: $1.99 (199 cents)
    - Description: Premium digital download track

  3. Security
    - Uses existing RLS policies
    - Maintains data integrity with proper indexing
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

-- Check if $DOWNLOAD track already exists and handle accordingly
DO $$
BEGIN
  -- First, check if the track already exists
  IF NOT EXISTS (
    SELECT 1 FROM music_tracks 
    WHERE title = '$DOWNLOAD' AND artist = 'DLD'
  ) THEN
    -- Insert the new track if it doesn't exist
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
  ELSE
    -- Update existing track with new Stripe Price ID and other details
    UPDATE music_tracks SET
      stripe_price_id = 'price_1RZeCfGKbDbFMYBRBxzujgeH',
      price_cents = 199,
      description = 'Premium digital download - High quality audio track from Daniel in the Lion''s Den',
      updated_at = now()
    WHERE title = '$DOWNLOAD' AND artist = 'DLD';
  END IF;
END $$;

-- Create index for stripe_price_id if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_music_tracks_stripe_price_id ON music_tracks(stripe_price_id);