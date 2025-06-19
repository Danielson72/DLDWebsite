export interface Track {
  id: string;
  title: string;
  artist: string;
  description: string | null;
  price_cents: number;
  stripe_price_id: string | null;
  audio_full: string | null;
  audio_preview: string | null;
  preview_url: string | null; // New field for 30-second preview clips
  cover_url: string | null;
  cover_image_url: string | null; // Custom artwork field
  waveform_json: number[] | null;
  created_at: string | null;
  updated_at: string | null;
  user_id: string | null;
  currency: string | null;
  is_active: boolean | null;
}

export type Artist = 'DLD' | 'The Tru Witnesses' | 'Waves From IAM';
</invoke>