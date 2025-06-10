/*
  # Fix storage bucket policies for music uploads

  1. Storage Setup
    - Create 'my-music' bucket if it doesn't exist
  
  2. Security Policies
    - Drop existing policies to avoid conflicts
    - Create policies for authenticated users to upload files
    - Allow public read access for streaming
    - Allow users to manage their own files
*/

-- Create storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('my-music', 'my-music', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Authenticated users can upload music files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own music files" ON storage.objects;
DROP POLICY IF EXISTS "Public can view music files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own music files" ON storage.objects;
DROP POLICY IF EXISTS "allow_upload_my_music" ON storage.objects;

-- Policy to allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload music files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'my-music');

-- Policy to allow authenticated users to update files they uploaded
CREATE POLICY "Users can update their own music files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'my-music' AND auth.uid()::text = (storage.foldername(name))[1])
WITH CHECK (bucket_id = 'my-music' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Policy to allow public read access to music files
CREATE POLICY "Public can view music files"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'my-music');

-- Policy to allow authenticated users to delete their own files
CREATE POLICY "Users can delete their own music files"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'my-music' AND auth.uid()::text = (storage.foldername(name))[1]);