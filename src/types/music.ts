export interface Track {
  id: string;
  title: string;
  artist: string;
  description: string | null;
  price_cents: number;
  stripe_price_id: string | null;
  audio_full: string | null;
  audio_preview: string | null;
  cover_url: string | null;
  cover_image_url: string | null; // New field for custom artwork
  waveform_json: number[] | null;
  created_at: string | null;
  updated_at: string | null;
  user_id: string | null;
}

export type Artist = 'DLD' | 'True Witnesses' | 'Project 3';