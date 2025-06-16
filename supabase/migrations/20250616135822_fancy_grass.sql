/*
  # Add New Song Listing

  1. New Track
    - Title: "Kingdom Anthem"
    - Artist: "DLD" (Daniel in the Lion's Den)
    - Price: $0.99 (99 cents)
    - Stripe Price ID: price_1RZeCfGKbDbFMYBRBxzujgeH
    - Description: Original Kingdom music track
    - Placeholder URLs for audio and cover (to be replaced with actual content)

  2. Integration
    - Uses existing database structure
    - Compatible with current payment system
    - Maintains all existing functionality
*/

-- Insert new song listing with $0.99 price
INSERT INTO music_tracks (
  title,
  artist,
  description,
  price_cents,
  stripe_price_id,
  audio_full,
  audio_preview,
  cover_url,
  cover_image_url,
  currency,
  is_active,
  created_at,
  updated_at
) VALUES (
  'Kingdom Anthem',
  'DLD',
  'An uplifting Kingdom music track that speaks to identity, purpose, and divine calling. Experience the power of worship through sound.',
  99, -- $0.99 in cents
  'price_1RZeCfGKbDbFMYBRBxzujgeH',
  'https://example.com/kingdom-anthem-full.mp3', -- Replace with actual full audio URL
  'https://example.com/kingdom-anthem-preview.mp3', -- Replace with actual preview URL
  'https://example.com/kingdom-anthem-cover.jpg', -- Replace with actual cover URL
  'https://example.com/kingdom-anthem-cover.jpg', -- Replace with actual cover URL
  'usd',
  true,
  now(),
  now()
);