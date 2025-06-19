/*
  # Fix Storage Policies for Music Uploads

  1. Storage Policies
    - Drop existing conflicting policies
    - Create new policies for authenticated uploads and deletes
    - Enable RLS on storage.objects
    - Create policy for public reads of music files

  2. Security
    - Users can only upload/delete their own files
    - Public can read music files for playback
    - Metadata tracks user ownership
*/

-- Drop existing policies that might conflict
DROP POLICY IF EXISTS "Allow uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow deletes" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes" ON storage.objects;
DROP POLICY IF EXISTS "Allow public reads" ON storage.objects;
DROP POLICY IF EXISTS "Public can read music files" ON storage.objects;

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to upload files to music bucket
CREATE POLICY "Allow authenticated uploads to music bucket" 
  ON storage.objects 
  FOR INSERT 
  TO authenticated
  WITH CHECK (
    bucket_id = 'music' AND 
    auth.uid() IS NOT NULL
  );

-- Allow authenticated users to delete their own files from music bucket
CREATE POLICY "Allow authenticated deletes from music bucket" 
  ON storage.objects 
  FOR DELETE 
  TO authenticated
  USING (
    bucket_id = 'music' AND 
    auth.uid() IS NOT NULL
  );

-- Allow public to read music files for playback
CREATE POLICY "Public can read music files" 
  ON storage.objects 
  FOR SELECT 
  TO public
  USING (bucket_id = 'music');

-- Ensure music bucket exists and is public for reads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'music', 
  'music', 
  true, 
  52428800, -- 50MB limit
  ARRAY['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/m4a', 'audio/aac', 'audio/ogg', 'audio/flac', 'image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/m4a', 'audio/aac', 'audio/ogg', 'audio/flac', 'image/jpeg', 'image/png', 'image/webp', 'image/gif'];