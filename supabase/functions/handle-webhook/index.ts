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

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
    })

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

      // Extract track ID from metadata
      const trackId = session.metadata?.trackId
      if (!trackId) {
        console.error('No track ID found in session metadata')
        return new Response(
          JSON.stringify({ error: 'Missing track ID in session metadata' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
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
          user_id: session.client_reference_id || session.customer_details?.email, // You might need to adjust this based on how you set up the session
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

      console.log('Purchase recorded successfully for track:', track.title)

      // TODO: Send download link via email
      // You can implement email sending here using a service like SendGrid, Resend, etc.
      
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