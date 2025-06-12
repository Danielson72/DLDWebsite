/*
  # Storage Bucket and Music Tracks Setup

  1. Storage Setup
    - Create 'my-music' storage bucket with public access
    - Note: Storage policies must be created manually in Supabase Dashboard

  2. Music Tracks Table
    - Enable RLS and create proper policies
    - Allow authenticated users to manage tracks
    - Allow public read access for streaming

  IMPORTANT: Storage policies cannot be created via SQL migration due to permissions.
  These must be created manually in the Supabase Dashboard under Storage > Policies:

  Required Storage Policies for storage.objects:
  1. "Authenticated users can upload to my-music"
     - Operation: INSERT, Target: authenticated
     - WITH CHECK: bucket_id = 'my-music'

  2. "Public can read my-music files"
     - Operation: SELECT, Target: public
     - USING: bucket_id = 'my-music'

  3. "Users can update their own my-music files"
     - Operation: UPDATE, Target: authenticated
     - USING: bucket_id = 'my-music'
     - WITH CHECK: bucket_id = 'my-music'

  4. "Users can delete their own my-music files"
     - Operation: DELETE, Target: authenticated
     - USING: bucket_id = 'my-music'
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

-- Fix music_tracks table policies
-- Drop existing policies that may use incorrect functions
DROP POLICY IF EXISTS "Authenticated users can insert music tracks" ON music_tracks;
DROP POLICY IF EXISTS "Authenticated users can update music tracks" ON music_tracks;
DROP POLICY IF EXISTS "Authenticated users can delete music tracks" ON music_tracks;
DROP POLICY IF EXISTS "Music tracks are publicly readable" ON music_tracks;

-- Ensure RLS is enabled on music_tracks
ALTER TABLE music_tracks ENABLE ROW LEVEL SECURITY;

-- Music tracks policy: Public can read all tracks
CREATE POLICY "Music tracks are publicly readable"
ON music_tracks
FOR SELECT
TO public
USING (true);

-- Music tracks policy: Only authenticated users can insert tracks
CREATE POLICY "Authenticated users can insert music tracks"
ON music_tracks
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

-- Music tracks policy: Only authenticated users can update tracks
CREATE POLICY "Authenticated users can update music tracks"
ON music_tracks
FOR UPDATE
TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Music tracks policy: Only authenticated users can delete tracks
CREATE POLICY "Authenticated users can delete music tracks"
ON music_tracks
FOR DELETE
TO authenticated
USING (auth.uid() IS NOT NULL);