import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { default: Stripe } = await import('npm:stripe@14.25.0')
    
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
    
    if (!stripeSecretKey || !webhookSecret) {
      console.error('Missing required environment variables')
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    const stripe = new Stripe(stripeSecretKey, { apiVersion: '2023-10-16' })

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get the raw body and signature
    const body = await req.text()
    const signature = req.headers.get('stripe-signature')

    if (!signature) {
      return new Response(
        JSON.stringify({ error: 'Missing stripe signature' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Verify the webhook signature
    let event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      return new Response(
        JSON.stringify({ error: 'Invalid signature' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    console.log('Received webhook event:', event.type)

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any

      console.log('Processing completed checkout session:', session.id)

      const trackId = session.metadata?.track_id
      const supabaseUid = session.metadata?.supabase_uid || session.client_reference_id

      if (!trackId || !supabaseUid) {
        console.error('Missing required metadata:', { trackId, supabaseUid })
        return new Response(
          JSON.stringify({ error: 'Missing required session metadata' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }

      // Check if purchase already exists
      const { data: existingPurchase } = await supabase
        .from('purchases')
        .select('id')
        .eq('stripe_session_id', session.id)
        .single()

      if (existingPurchase) {
        console.log('Purchase already recorded for session:', session.id)
        return new Response(
          JSON.stringify({ success: true, message: 'Purchase already recorded' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Get track details
      const { data: track, error: trackError } = await supabase
        .from('music_tracks')
        .select('*')
        .eq('id', trackId)
        .single()

      if (trackError || !track) {
        console.error('Track not found:', trackId)
        return new Response(
          JSON.stringify({ error: 'Track not found' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
        )
      }

      // Create purchase record
      const { error: purchaseError } = await supabase
        .from('purchases')
        .insert({
          user_id: supabaseUid,
          track_id: trackId,
          stripe_session_id: session.id,
          amount_cents: session.amount_total,
          currency: session.currency,
          status: 'paid',
          purchased_at: new Date().toISOString(),
        })

      if (purchaseError) {
        console.error('Failed to create purchase record:', purchaseError)
        return new Response(
          JSON.stringify({ error: 'Failed to record purchase' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }

      // Create resource record for the downloaded file
      if (track.audio_full) {
        const { error: resourceError } = await supabase
          .from('resources')
          .insert({
            user_id: supabaseUid,
            track_id: trackId,
            file_type: 'audio',
            description: `Full track: ${track.title} by ${track.artist}`,
            file_url: track.audio_full,
          })

        if (resourceError) {
          console.error('Failed to create resource record:', resourceError)
          // Don't fail the webhook for this, as the purchase is already recorded
        }
      }

      console.log('Purchase recorded successfully for track:', track.title)

      return new Response(
        JSON.stringify({ success: true, message: 'Purchase processed successfully' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Handle other webhook events as needed
    console.log('Unhandled webhook event type:', event.type)

    return new Response(
      JSON.stringify({ success: true, message: 'Webhook received' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: any) {
    console.error('Webhook handler error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})