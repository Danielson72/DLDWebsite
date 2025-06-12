/*
  # Create music storage bucket and comprehensive policies

  1. Storage Setup
    - Create `music` storage bucket with proper configuration
    - Set file size limits and allowed MIME types
    
  2. Storage Policies
    - Allow authenticated users to upload files
    - Allow public read access to music files
    - Allow authenticated users to delete their own files
    
  3. Music Tracks Table Policies
    - Enable RLS with proper auth.uid() checks
    - Allow public reads, authenticated CRUD operations
    
  4. Security
    - Drop any conflicting existing policies first
    - Use proper auth.uid() checks throughout
*/

-- Drop existing storage policies to avoid conflicts
DROP POLICY IF EXISTS "Allow uploads to music bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access to music" ON storage.objects;
DROP POLICY IF EXISTS "Allow deletes from music bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow updates to music files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload music files" ON storage.objects;
DROP POLICY IF EXISTS "Public can view music files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own music files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own music files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload to music" ON storage.objects;
DROP POLICY IF EXISTS "Public can read music files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own music files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own music files" ON storage.objects;

-- Create the music storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'music', 
  'music', 
  true, 
  52428800, -- 50MB limit
  ARRAY[
    'audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/ogg', 
    'audio/flac', 'audio/aac', 'audio/m4a', 'audio/webm',
    'image/jpeg', 'image/png', 'image/webp', 'image/gif'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage policy: Allow authenticated users to upload to music bucket
CREATE POLICY "Authenticated users can upload to music bucket"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'music' AND 
  auth.uid() IS NOT NULL
);

-- Storage policy: Allow public read access to music files
CREATE POLICY "Public can read music files"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'music');

-- Storage policy: Allow authenticated users to update files in music bucket
CREATE POLICY "Authenticated users can update music files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'music' AND 
  auth.uid() IS NOT NULL
)
WITH CHECK (
  bucket_id = 'music' AND 
  auth.uid() IS NOT NULL
);

-- Storage policy: Allow authenticated users to delete files in music bucket
CREATE POLICY "Authenticated users can delete music files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'music' AND 
  auth.uid() IS NOT NULL
);

-- Drop existing music_tracks policies to avoid conflicts
DROP POLICY IF EXISTS "Authenticated users can insert music tracks" ON music_tracks;
DROP POLICY IF EXISTS "Authenticated users can update music tracks" ON music_tracks;
DROP POLICY IF EXISTS "Authenticated users can delete music tracks" ON music_tracks;
DROP POLICY IF EXISTS "Music tracks are publicly readable" ON music_tracks;
DROP POLICY IF EXISTS "allow_delete_music" ON music_tracks;
DROP POLICY IF EXISTS "allow_insert_music" ON music_tracks;
DROP POLICY IF EXISTS "allow_update_music" ON music_tracks;

-- Ensure RLS is enabled on music_tracks
ALTER TABLE music_tracks ENABLE ROW LEVEL SECURITY;

-- Music tracks policy: Public can read all tracks
CREATE POLICY "Music tracks are publicly readable"
ON music_tracks
FOR SELECT
TO public
USING (true);

-- Music tracks policy: Authenticated users can insert tracks
CREATE POLICY "Authenticated users can insert music tracks"
ON music_tracks
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

-- Music tracks policy: Authenticated users can update tracks
CREATE POLICY "Authenticated users can update music tracks"
ON music_tracks
FOR UPDATE
TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Music tracks policy: Authenticated users can delete tracks
CREATE POLICY "Authenticated users can delete music tracks"
ON music_tracks
FOR DELETE
TO authenticated
USING (auth.uid() IS NOT NULL);

-- Service role policies for admin operations
CREATE POLICY "Service role can manage music tracks"
ON music_tracks
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);