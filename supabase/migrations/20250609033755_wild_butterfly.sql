/*
  # Create music storage bucket and policies

  1. Storage Setup
    - Create 'music' bucket for audio files
    - Set file size limit to 50MB
    - Allow audio file types

  2. Security Policies
    - Allow authenticated users to upload files
    - Allow public read access to files
    - Allow authenticated users to delete files
*/

-- Create the music bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'music', 
  'music', 
  true, 
  52428800, -- 50MB limit
  ARRAY['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/ogg', 'audio/flac', 'audio/aac', 'audio/m4a', 'image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow uploads to music bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access to music" ON storage.objects;
DROP POLICY IF EXISTS "Allow deletes from music bucket" ON storage.objects;

-- Allow authenticated users to upload to music bucket
CREATE POLICY "Allow uploads to music bucket"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'music');

-- Allow public read access to files in music bucket
CREATE POLICY "Allow public read access to music"
ON storage.objects
FOR SELECT
USING (bucket_id = 'music');

-- Allow authenticated users to delete files in music bucket
CREATE POLICY "Allow deletes from music bucket"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'music');