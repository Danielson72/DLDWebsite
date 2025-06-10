/*
  # Fix storage bucket permissions for music uploads

  1. Storage Bucket
    - Create or update `my-music` bucket with public access
  
  2. Storage Policies
    - Allow anonymous and authenticated users to upload files
    - Allow public read access to files
    - Allow users to manage their own files
*/

-- Create the my-music bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'my-music', 
  'my-music', 
  true, 
  52428800, -- 50MB limit
  ARRAY['audio/mpeg', 'audio/wav', 'audio/mp3', 'image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "allow_upload_my_music" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload music files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own music files" ON storage.objects;
DROP POLICY IF EXISTS "Public can view music files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own music files" ON storage.objects;

-- Allow anyone (including anonymous users) to upload to my-music bucket
CREATE POLICY "Allow uploads to my-music bucket"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'my-music');

-- Allow public read access to files in my-music bucket
CREATE POLICY "Allow public read access to my-music"
ON storage.objects
FOR SELECT
USING (bucket_id = 'my-music');

-- Allow authenticated users to update files in my-music bucket
CREATE POLICY "Allow updates to my-music files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'my-music')
WITH CHECK (bucket_id = 'my-music');

-- Allow authenticated users to delete files in my-music bucket
CREATE POLICY "Allow deletes from my-music bucket"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'my-music');