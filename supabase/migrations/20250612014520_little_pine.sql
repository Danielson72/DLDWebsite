/*
  # Fix Music Storage and Policies

  1. Storage Setup
    - Create music storage bucket with proper configuration
    - Set up comprehensive storage policies for authenticated operations
  
  2. Database Policies
    - Update music_tracks table policies for proper RLS
    - Ensure service role access for admin operations
  
  3. Security
    - Enable RLS on music_tracks table
    - Allow public reads, authenticated writes
*/

-- First, let's get all existing policy names for storage.objects related to music
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    -- Drop all existing storage policies that might conflict
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage'
        AND (
            policyname ILIKE '%music%' OR 
            policyname ILIKE '%upload%' OR 
            policyname ILIKE '%delete%' OR 
            policyname ILIKE '%update%' OR 
            policyname ILIKE '%read%'
        )
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', policy_record.policyname);
    END LOOP;
END $$;

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
CREATE POLICY "music_bucket_authenticated_insert"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'music' AND 
  auth.uid() IS NOT NULL
);

-- Storage policy: Allow public read access to music files
CREATE POLICY "music_bucket_public_select"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'music');

-- Storage policy: Allow authenticated users to update files in music bucket
CREATE POLICY "music_bucket_authenticated_update"
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
CREATE POLICY "music_bucket_authenticated_delete"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'music' AND 
  auth.uid() IS NOT NULL
);

-- Now handle music_tracks table policies
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    -- Drop all existing music_tracks policies
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'music_tracks' 
        AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON music_tracks', policy_record.policyname);
    END LOOP;
END $$;

-- Ensure RLS is enabled on music_tracks
ALTER TABLE music_tracks ENABLE ROW LEVEL SECURITY;

-- Music tracks policy: Public can read all tracks
CREATE POLICY "music_tracks_public_select"
ON music_tracks
FOR SELECT
TO public
USING (true);

-- Music tracks policy: Authenticated users can insert tracks
CREATE POLICY "music_tracks_authenticated_insert"
ON music_tracks
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

-- Music tracks policy: Authenticated users can update tracks
CREATE POLICY "music_tracks_authenticated_update"
ON music_tracks
FOR UPDATE
TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Music tracks policy: Authenticated users can delete tracks
CREATE POLICY "music_tracks_authenticated_delete"
ON music_tracks
FOR DELETE
TO authenticated
USING (auth.uid() IS NOT NULL);

-- Service role policies for admin operations
CREATE POLICY "music_tracks_service_role_all"
ON music_tracks
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);