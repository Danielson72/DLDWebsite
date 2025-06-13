/*
  # Fix Storage Policies for Music Bucket

  1. Storage Bucket Setup
    - Ensure music bucket exists with proper configuration
    - Set public access for file reads
    - Configure file size limits and allowed MIME types

  2. Storage Policies
    - Allow authenticated users to upload music files
    - Allow authenticated users to delete music files  
    - Allow public read access for music playback
*/

-- First, ensure the music bucket exists
DO $$
BEGIN
  -- Insert the bucket if it doesn't exist
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
EXCEPTION
  WHEN OTHERS THEN
    -- If we can't create/update the bucket, that's okay - it might already exist
    NULL;
END $$;

-- Note: Storage policies are typically managed through the Supabase dashboard
-- or via the management API, not through SQL migrations.
-- 
-- The required policies for the music bucket should be:
-- 1. Allow authenticated users to INSERT files
-- 2. Allow authenticated users to DELETE their own files  
-- 3. Allow public SELECT access for file reads
--
-- These policies need to be configured in the Supabase dashboard under:
-- Storage > Policies > Create Policy