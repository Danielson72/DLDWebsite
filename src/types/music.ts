export interface Track {
  id: string;
  title: string;
  artist: string;
  description: string | null;
  price_cents: number;
  audio_full: string | null;
  audio_preview: string | null;
  cover_url: string | null;
  waveform_json: number[] | null;
  created_at: string | null;
  updated_at: string | null;
  user_id: string | null; // Added for ownership tracking
}

export type Artist = 'DLD' | 'True Witnesses' | 'Project 3';