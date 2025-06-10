/*
  # Fix Storage Upload Permissions

  1. Storage Bucket Setup
    - Ensure 'my-music' bucket exists and is public
  2. Storage Policies
    - Allow authenticated users to upload to my-music bucket
    - Allow public read access to my-music bucket
    - Allow authenticated users to delete from my-music bucket
*/

-- Create the my-music bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'my-music', 
  'my-music', 
  true, 
  52428800, -- 50MB limit
  ARRAY['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/ogg', 'audio/flac']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated uploads to my-music" ON storage.objects;
DROP POLICY IF EXISTS "Allow public downloads from my-music" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes from my-music" ON storage.objects;

-- Policy: Allow authenticated users to upload to my-music bucket
CREATE POLICY "Allow authenticated uploads to my-music"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'my-music');

-- Policy: Allow public read access to my-music bucket
CREATE POLICY "Allow public downloads from my-music"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'my-music');

-- Policy: Allow authenticated users to delete from my-music bucket
CREATE POLICY "Allow authenticated deletes from my-music"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'my-music');