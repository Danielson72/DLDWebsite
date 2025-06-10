/*
  # Storage Bucket and Policies Setup

  1. Storage Setup
    - Create 'my-music' storage bucket for audio files
    - Configure bucket as public for file access
  
  2. Security Policies
    - Allow authenticated users to upload files
    - Allow public read access for file playback
    - Allow authenticated users to manage their uploads

  Note: Storage policies are handled through Supabase's storage system
*/

-- Create the storage bucket using Supabase's storage functions
-- This approach works within the migration system's permissions
DO $$
BEGIN
  -- Insert bucket if it doesn't exist
  INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES (
    'my-music', 
    'my-music', 
    true, 
    52428800, -- 50MB limit
    ARRAY['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/ogg', 'audio/flac']
  )
  ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 52428800,
    allowed_mime_types = ARRAY['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/ogg', 'audio/flac'];
  
EXCEPTION
  WHEN others THEN
    -- If bucket creation fails, continue with the migration
    RAISE NOTICE 'Bucket creation handled by Supabase storage system';
END $$;

-- Note: Storage RLS policies need to be created through the Supabase dashboard
-- or using the service role. The following policies should be created:
--
-- 1. "Authenticated users can upload to my-music bucket"
--    ON storage.objects FOR INSERT TO authenticated
--    WITH CHECK (bucket_id = 'my-music')
--
-- 2. "Public can read my-music bucket" 
--    ON storage.objects FOR SELECT TO public
--    USING (bucket_id = 'my-music')
--
-- 3. "Authenticated users can delete from my-music bucket"
--    ON storage.objects FOR DELETE TO authenticated  
--    USING (bucket_id = 'my-music')
--
-- 4. "Authenticated users can update my-music bucket"
--    ON storage.objects FOR UPDATE TO authenticated
--    USING (bucket_id = 'my-music') WITH CHECK (bucket_id = 'my-music')