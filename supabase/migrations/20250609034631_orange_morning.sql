/*
  # Fix RLS policies for music_tracks table

  1. Security Updates
    - Drop existing policies with incorrect uid() function
    - Create new policies using correct auth.uid() function
    - Ensure authenticated users can insert and update tracks
    - Keep public read access for music tracks

  2. Policy Changes
    - INSERT: Allow authenticated users to insert tracks
    - UPDATE: Allow authenticated users to update tracks  
    - DELETE: Allow authenticated users to delete tracks
    - SELECT: Keep public read access
*/

-- Drop existing policies that use incorrect uid() function
DROP POLICY IF EXISTS "Allow authenticated users to delete music tracks" ON music_tracks;
DROP POLICY IF EXISTS "Authenticated users can insert music tracks" ON music_tracks;
DROP POLICY IF EXISTS "Authenticated users can manage music tracks" ON music_tracks;
DROP POLICY IF EXISTS "Authenticated users can update music tracks" ON music_tracks;
DROP POLICY IF EXISTS "Music tracks are publicly readable" ON music_tracks;

-- Create new policies with correct auth.uid() function
CREATE POLICY "Music tracks are publicly readable"
  ON music_tracks
  FOR SELECT
  TO public
  USING (true);

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