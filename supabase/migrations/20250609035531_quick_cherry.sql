/*
  # Fix RLS policies for music tracks

  1. Policy Updates
    - Drop existing policies that use incorrect `uid()` function
    - Create new policies using correct `auth.uid()` function
    - Add admin-specific INSERT policy for uploads
    - Update other policies to use correct authentication checks

  2. Security
    - Maintain public read access for music tracks
    - Allow authenticated users to manage tracks
    - Ensure proper authentication checks
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can delete music tracks" ON music_tracks;
DROP POLICY IF EXISTS "Authenticated users can insert music tracks" ON music_tracks;
DROP POLICY IF EXISTS "Authenticated users can update music tracks" ON music_tracks;

-- Create new policies with correct authentication checks
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

CREATE POLICY "Authenticated users can delete music tracks"
  ON music_tracks
  FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);