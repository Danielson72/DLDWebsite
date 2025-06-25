/*
  # Fix Storage and Database RLS Policies for Authenticated Users

  1. Storage Setup
    - Create 'my-music' bucket with proper configuration
    - Set up RLS policies for authenticated users only
    - Ensure owner-based access control

  2. Database Policies
    - Fix music_tracks table policies to use correct auth functions
    - Restrict operations to authenticated users only
    - Remove anonymous access

  3. Security
    - Enable strict RLS on all tables
    - Only authenticated users can upload/manage files
    - Users can only manage their own uploads
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

-- Drop all existing storage policies to start fresh
DROP POLICY IF EXISTS "Allow uploads to my-music bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access to my-music" ON storage.objects;
DROP POLICY IF EXISTS "Allow deletes from my-music bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow updates to my-music files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload music files" ON storage.objects;
DROP POLICY IF EXISTS "Public can view music files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own music files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own music files" ON storage.objects;

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Storage policy: Allow authenticated users to upload to my-music bucket
CREATE POLICY "Authenticated users can upload to my-music"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'my-music' AND 
  auth.uid() = owner
);

-- Storage policy: Allow public read access to my-music files
CREATE POLICY "Public can read my-music files"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'my-music');

-- Storage policy: Allow users to update their own files
CREATE POLICY "Users can update their own my-music files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'my-music' AND 
  auth.uid() = owner
)
WITH CHECK (
  bucket_id = 'my-music' AND 
  auth.uid() = owner
);

-- Storage policy: Allow users to delete their own files
CREATE POLICY "Users can delete their own my-music files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'my-music' AND 
  auth.uid() = owner
);

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