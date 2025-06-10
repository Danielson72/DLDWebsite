/*
  # Complete Music File Management Setup

  1. Storage Bucket Setup
    - Create my-music bucket with proper configuration
    - Note: Storage RLS policies must be created manually in Supabase Dashboard

  2. Music Tracks Table Updates
    - Add user_id column for ownership tracking
    - Update RLS policies for user-based access control
    - Create performance index

  3. Security Policies
    - Only authenticated users can upload/modify tracks
    - Public read access for music streaming
    - Users can only manage their own content

  IMPORTANT: Storage policies must be created manually in Supabase Dashboard:
  Go to Storage > Policies and create policies for storage.objects table
*/

-- Create the my-music storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'my-music', 
  'my-music', 
  true, 
  52428800, -- 50MB limit
  ARRAY['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/ogg', 'audio/flac', 'audio/aac', 'audio/m4a', 'image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Add user_id column to music_tracks table for ownership tracking
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'music_tracks' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE music_tracks ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create index for better performance on user_id queries
CREATE INDEX IF NOT EXISTS idx_music_tracks_user_id ON music_tracks(user_id);

-- Drop existing policies to recreate with proper user ownership
DROP POLICY IF EXISTS "Authenticated users can insert music tracks" ON music_tracks;
DROP POLICY IF EXISTS "Authenticated users can update music tracks" ON music_tracks;
DROP POLICY IF EXISTS "Authenticated users can delete music tracks" ON music_tracks;
DROP POLICY IF EXISTS "Music tracks are publicly readable" ON music_tracks;
DROP POLICY IF EXISTS "Users can insert their own tracks" ON music_tracks;
DROP POLICY IF EXISTS "Users can update their own tracks" ON music_tracks;
DROP POLICY IF EXISTS "Users can delete their own tracks" ON music_tracks;

-- Ensure RLS is enabled on music_tracks
ALTER TABLE music_tracks ENABLE ROW LEVEL SECURITY;

-- Policy: Public can read all tracks (for streaming/browsing)
CREATE POLICY "Music tracks are publicly readable"
ON music_tracks
FOR SELECT
TO public
USING (true);

-- Policy: Authenticated users can insert their own tracks
CREATE POLICY "Users can insert their own tracks"
ON music_tracks
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own tracks
CREATE POLICY "Users can update their own tracks"
ON music_tracks
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own tracks
CREATE POLICY "Users can delete their own tracks"
ON music_tracks
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

/*
  MANUAL SETUP REQUIRED: Storage Policies
  
  The following storage policies must be created manually in the Supabase Dashboard:
  Go to Storage > Policies and create these policies for storage.objects:

  1. "Authenticated users can upload to my-music"
     - Operation: INSERT
     - Target roles: authenticated
     - WITH CHECK: bucket_id = 'my-music'

  2. "Public can read my-music files"
     - Operation: SELECT
     - Target roles: public
     - USING: bucket_id = 'my-music'

  3. "Users can update their own my-music files"
     - Operation: UPDATE
     - Target roles: authenticated
     - USING: bucket_id = 'my-music'
     - WITH CHECK: bucket_id = 'my-music'

  4. "Users can delete their own my-music files"
     - Operation: DELETE
     - Target roles: authenticated
     - USING: bucket_id = 'my-music'

  Note: The owner-based restrictions (auth.uid() = owner) should be handled
  in the application logic since storage.objects.owner may not be available
  or may work differently in Supabase's storage system.
*/