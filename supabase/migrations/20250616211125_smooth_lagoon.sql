/*
  # Add preview_url column to music_tracks

  1. New Columns
    - `preview_url` (text, nullable) - URL to 30-second preview clip

  2. Performance
    - Add index on preview_url for faster queries
*/

-- Add preview_url column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'music_tracks' AND column_name = 'preview_url'
  ) THEN
    ALTER TABLE music_tracks ADD COLUMN preview_url text;
  END IF;
END $$;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_music_tracks_preview_url ON music_tracks(preview_url);

-- Add comment for documentation
COMMENT ON COLUMN music_tracks.preview_url IS '30-second preview clip URL generated automatically';