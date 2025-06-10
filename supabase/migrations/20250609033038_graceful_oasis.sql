/*
  # Enable delete operations for music tracks and storage

  1. Storage Policies
    - Create delete policy for music bucket files
    - Allow authenticated users to delete their uploaded files

  2. Database Policies  
    - Create delete policy for music_tracks table
    - Allow authenticated users to delete track records

  Note: We don't modify storage.objects table directly as it's managed by Supabase
*/

-- Create storage policy for deleting files from music bucket
-- This works with Supabase's existing storage.objects table structure
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('music', 'music', true, 52428800, ARRAY['audio/mpeg', 'audio/wav', 'audio/mp3', 'image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Create policy for deleting files from music bucket
-- This uses Supabase's storage policy system
CREATE POLICY "Allow authenticated users to delete music files"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'music');

-- Music tracks table delete policy
-- Enable RLS is already done in previous migrations, but ensure it's set
ALTER TABLE music_tracks ENABLE ROW LEVEL SECURITY;

-- Create delete policy for music tracks
CREATE POLICY "Allow authenticated users to delete music tracks"
ON music_tracks
FOR DELETE
TO authenticated
USING (true);