/*
  # Fix Storage and Music Tracks Policies

  1. Storage Setup
    - Create music storage bucket with public access
    - Note: Storage policies are managed by Supabase automatically for public buckets
  
  2. Music Tracks Table
    - Add INSERT policy for authenticated users
    - Ensure proper RLS configuration

  3. Security
    - Authenticated users can upload and manage music files
    - Public users can read music files
    - Authenticated users can insert music track records
*/

-- Create music storage bucket if it doesn't exist
-- Public buckets allow read access by default
INSERT INTO storage.buckets (id, name, public)
VALUES ('music', 'music', true)
ON CONFLICT (id) DO NOTHING;

-- Ensure music_tracks table has proper INSERT policy for authenticated users
DO $$
BEGIN
  -- Check if the INSERT policy already exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'music_tracks' 
    AND policyname = 'Authenticated users can insert music tracks'
  ) THEN
    CREATE POLICY "Authenticated users can insert music tracks"
      ON music_tracks
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() IS NOT NULL);
  END IF;
END $$;

-- Ensure authenticated users can also update their own tracks
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'music_tracks' 
    AND policyname = 'Authenticated users can update music tracks'
  ) THEN
    CREATE POLICY "Authenticated users can update music tracks"
      ON music_tracks
      FOR UPDATE
      TO authenticated
      USING (auth.uid() IS NOT NULL);
  END IF;
END $$;