/*
  # Complete Music File Management with RLS Security

  1. Storage Bucket Setup
    - Create my-music bucket with proper configuration
    - Set file size limits and allowed MIME types

  2. Music Tracks Table Updates
    - Add user_id column to track ownership
    - Update RLS policies for user-based access control

  3. Security Policies
    - Only authenticated users can upload/modify files
    - Public read access for music streaming
    - Users can only manage their own content

  Note: Storage policies must be created manually in Supabase Dashboard
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
ALTER TABLE music_tracks 
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create index for better performance on user_id queries
CREATE INDEX IF NOT EXISTS idx_music_tracks_user_id ON music_tracks(user_id);

-- Drop existing policies to recreate with proper user ownership
DROP POLICY IF EXISTS "Authenticated users can insert music tracks" ON music_tracks;
DROP POLICY IF EXISTS "Authenticated users can update music tracks" ON music_tracks;
DROP POLICY IF EXISTS "Authenticated users can delete music tracks" ON music_tracks;
DROP POLICY IF EXISTS "Music tracks are publicly readable" ON music_tracks;

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

-- Update existing tracks to have a default user_id (admin user)
-- This is for existing tracks that don't have an owner
UPDATE music_tracks 
SET user_id = (
  SELECT id FROM auth.users 
  WHERE email = 'admin@example.com' -- Replace with actual admin email
  LIMIT 1
)
WHERE user_id IS NULL;

/*
  IMPORTANT: Manual Storage Policy Setup Required
  
  The following storage policies must be created manually in the Supabase Dashboard:
  Go to Storage > Policies and create these policies for storage.objects:

  1. "Authenticated users can upload to my-music"
     - Operation: INSERT
     - Target roles: authenticated
     - WITH CHECK: bucket_id = 'my-music' AND auth.uid() = owner

  2. "Public can read my-music files"
     - Operation: SELECT
     - Target roles: public
     - USING: bucket_id = 'my-music'

  3. "Users can update their own my-music files"
     - Operation: UPDATE
     - Target roles: authenticated
     - USING: bucket_id = 'my-music' AND auth.uid() = owner
     - WITH CHECK: bucket_id = 'my-music' AND auth.uid() = owner

  4. "Users can delete their own my-music files"
     - Operation: DELETE
     - Target roles: authenticated
     - USING: bucket_id = 'my-music' AND auth.uid() = owner
*/