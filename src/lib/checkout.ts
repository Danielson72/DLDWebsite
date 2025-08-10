import { supabase } from './supabase';

export async function requireSession() {
  const { data } = await supabase.auth.getSession();
  const session = data.session;
  if (!session) {
    // If you have an auth modal, fire it. Otherwise send to /register
    window.dispatchEvent(new CustomEvent('open-auth-modal'));
    throw new Error('NO_SESSION');
  }
  return session;
}

// Default Stripe price if a track is missing one (your 99¢ price):
const DEFAULT_PRICE_ID = 'price_1MlFZQGKbDbFMYBRKOBe8Kf4';

export async function buyTrack(track: { id: string; title: string; stripe_price_id?: string }) {
  const session = await requireSession();
  const price_id = track.stripe_price_id ?? DEFAULT_PRICE_ID;

  const { data, error } = await supabase.functions.invoke('create-checkout', {
    body: {
      price_id,
      track_id: track.id,
      title: track.title,
      supabase_uid: session.user.id
    }
  });

  if (error) {
    console.error('createCheckout error', error);
    const errorDetails = error.details ? ` (${error.details})` : '';
    alert(`Error processing payment: ${error.message ?? 'Edge Function returned an error'}${errorDetails}`);
    return;
  }
  if (!data?.url) {
    console.error('createCheckout returned no URL', data);
    alert(`Payment error: missing checkout URL from server. Response: ${JSON.stringify(data)}`);
    return;
  }
  window.location.href = data.url;
}