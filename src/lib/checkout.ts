import { supabase } from './supabase'

type MusicTrack = { id: string; title: string; stripe_price_id: string }

export async function buyTrack(track: MusicTrack) {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    const evt = new CustomEvent('open-auth-modal')
    window.dispatchEvent(evt)
    return
  }

  try {
    // Call Supabase Edge Function via supabase-js so auth is forwarded
    const { data, error } = await supabase.functions.invoke('createCheckout', {
      body: { price_id: track.stripe_price_id, track_id: track.id }
    })

    if (error) {
      // Show detailed error message from the function
      const errorMessage = error.message || error.details || JSON.stringify(error)
      throw new Error(errorMessage)
    }

    const url = (data as any)?.url
    if (!url) {
      throw new Error('No checkout URL returned from server.')
    }
    window.location.href = url
  } catch (error: any) {
    // Dispatch error event for toast notification
    const evt = new CustomEvent('checkout-error', { 
      detail: { message: error.message || 'Failed to initiate checkout' }
    })
    window.dispatchEvent(evt)
  }
}