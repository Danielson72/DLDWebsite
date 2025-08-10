import { supabase } from './supabase'
import { stripePromise } from './stripe'

type MusicTrack = { id: string; title: string; stripe_price_id: string }

export async function buyTrack(track: MusicTrack) {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    // Dispatch custom event to open auth modal
    const evt = new CustomEvent('open-auth-modal')
    window.dispatchEvent(evt)
    alert('Please sign in to purchase.')
    return
  }

  // Call Supabase Edge Function via supabase-js so auth is forwarded
  const { data, error } = await supabase.functions.invoke('createCheckout', {
    body: { price_id: track.stripe_price_id, track_id: track.id }
  })

  if (error) {
    alert(`Checkout error: ${error.message ?? JSON.stringify(error)}`)
    return
  }

  const url = (data as any)?.url
  if (!url) {
    alert('Checkout error: No URL returned from server.')
    return
  }
  window.location.href = url
}