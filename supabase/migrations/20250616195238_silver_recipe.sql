/*
  # Storage RLS Policies for Music Files

  1. Security
    - Enable RLS on storage.objects table
    - Add policy for authenticated users to upload files
    - Add policy for users to view files they've purchased

  2. Notes
    - The 'music-files' bucket should be created via CLI: supabase storage bucket create music-files --public=false
    - These policies ensure secure file access based on purchase status
*/

-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to upload into the music-files bucket
CREATE POLICY "Authenticated users can upload files"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'music-files'
    AND auth.role() = 'authenticated'
  );

-- Allow users to view files they've purchased
CREATE POLICY "Users can view files they purchased"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'music-files' AND (
      auth.role() = 'admin'
      OR EXISTS (
        SELECT 1 FROM purchases p
         JOIN music_tracks m ON p.track_id = m.id
         WHERE
           p.user_id = auth.uid()
           AND p.status = 'paid'
           AND storage.objects.name LIKE m.id || '%'
      )
    )
  );