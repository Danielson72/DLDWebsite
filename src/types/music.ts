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
}

export type Artist = 'DLD' | 'The Tru Witnesses' | 'Project 3';