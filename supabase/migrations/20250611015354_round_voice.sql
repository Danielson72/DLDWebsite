/*
  # Lock Music Tracks RLS for Production

  1. Security Changes
    - Only service_role can INSERT/UPDATE/DELETE music tracks
    - Public can still SELECT (read) tracks for streaming
    - Removes authenticated user permissions for production safety

  2. Production Safety
    - Prevents unauthorized uploads in production
    - Maintains read access for public music streaming
    - Upload/delete functionality only available in Bolt development environment
*/

-- Ensure RLS is enabled on music_tracks
ALTER TABLE public.music_tracks ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Music tracks are publicly readable" ON public.music_tracks;
DROP POLICY IF EXISTS "Users can insert their own tracks" ON public.music_tracks;
DROP POLICY IF EXISTS "Users can update their own tracks" ON public.music_tracks;
DROP POLICY IF EXISTS "Users can delete their own tracks" ON public.music_tracks;
DROP POLICY IF EXISTS "Authenticated users can insert music tracks" ON public.music_tracks;
DROP POLICY IF EXISTS "Authenticated users can update music tracks" ON public.music_tracks;
DROP POLICY IF EXISTS "Authenticated users can delete music tracks" ON public.music_tracks;
DROP POLICY IF EXISTS "allow_insert_music" ON public.music_tracks;
DROP POLICY IF EXISTS "allow_delete_music" ON public.music_tracks;
DROP POLICY IF EXISTS "allow_update_music" ON public.music_tracks;

-- Public can read all tracks (for streaming)
CREATE POLICY "Music tracks are publicly readable"
  ON public.music_tracks
  FOR SELECT
  TO public
  USING (true);

-- Only service_role can insert tracks (production safety)
CREATE POLICY "allow_insert_music"
  ON public.music_tracks
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Only service_role can update tracks (production safety)
CREATE POLICY "allow_update_music"
  ON public.music_tracks
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Only service_role can delete tracks (production safety)
CREATE POLICY "allow_delete_music"
  ON public.music_tracks
  FOR DELETE
  TO service_role
  USING (true);