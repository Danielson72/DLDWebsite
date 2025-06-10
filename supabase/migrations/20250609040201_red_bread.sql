/*
  # Fix RLS policies for music uploads

  1. Database Changes
    - Fix music_tracks policies to use correct auth.uid() function
    - Ensure proper permissions for authenticated users

  2. Storage Changes
    - Create music bucket if needed
    - Note: Storage policies are handled automatically by Supabase for public buckets
*/

-- First, drop the existing policies that use the incorrect uid() function
DROP POLICY IF EXISTS "Authenticated users can delete music tracks" ON music_tracks;
DROP POLICY IF EXISTS "Authenticated users can insert music tracks" ON music_tracks;
DROP POLICY IF EXISTS "Authenticated users can update music tracks" ON music_tracks;

-- Create corrected policies using proper auth functions
CREATE POLICY "Authenticated users can delete music tracks"
  ON music_tracks
  FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert music tracks"
  ON music_tracks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update music tracks"
  ON music_tracks
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Create storage bucket if it doesn't exist
-- Note: We'll handle storage policies through the Supabase dashboard or CLI
INSERT INTO storage.buckets (id, name, public)
VALUES ('music', 'music', true)
ON CONFLICT (id) DO NOTHING;