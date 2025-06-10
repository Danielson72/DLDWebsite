/*
  # Setup Music Storage Bucket and Policies

  1. Storage Setup
    - Create 'my-music' storage bucket if it doesn't exist
    - Enable public access for the bucket
  
  2. Security Policies
    - Allow authenticated users to upload files (INSERT)
    - Allow public read access to files (SELECT)
    - Allow authenticated users to update their own files (UPDATE)
    - Allow authenticated users to delete their own files (DELETE)
  
  3. Notes
    - Files will be publicly accessible for streaming/download
    - Only authenticated users can upload new files
    - This supports the music streaming functionality
*/

-- Create the storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'my-music',
  'my-music',
  true,
  52428800, -- 50MB limit
  ARRAY['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/ogg', 'audio/flac', 'audio/aac', 'audio/m4a']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/ogg', 'audio/flac', 'audio/aac', 'audio/m4a'];

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload music files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'my-music');

-- Allow public read access to music files
CREATE POLICY "Public can view music files"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'my-music');

-- Allow authenticated users to update files
CREATE POLICY "Authenticated users can update music files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'my-music')
WITH CHECK (bucket_id = 'my-music');

-- Allow authenticated users to delete files
CREATE POLICY "Authenticated users can delete music files"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'my-music');