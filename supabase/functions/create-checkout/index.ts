import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')
    if (!stripeSecretKey) {
      console.error('STRIPE_SECRET_KEY environment variable is not set')
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { default: Stripe } = await import('npm:stripe@14.25.0')
    const stripe = new Stripe(stripeSecretKey, { apiVersion: '2023-10-16' })

    const { price_id, supabase_uid, track_id } = await req.json()

    if (!price_id || !supabase_uid || !track_id) {
      return new Response(
        JSON.stringify({ error: 'price_id, supabase_uid, and track_id are required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Verify the track exists and get its details
    const { data: track, error: trackError } = await supabase
      .from('music_tracks')
      .select('*')
      .eq('id', track_id)
      .eq('is_active', true)
      .single()

    if (trackError || !track) {
      return new Response(
        JSON.stringify({ error: 'Track not found or inactive' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      )
    }

    // Get user profile for customer info
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', supabase_uid)
      .single()

    const origin = req.headers.get('origin') || 'http://localhost:5173'

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: price_id,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/library?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/music?canceled=true`,
      client_reference_id: supabase_uid,
      customer_email: profile?.email,
      metadata: {
        track_id: track_id,
        track_title: track.title,
        artist: track.artist,
        supabase_uid: supabase_uid,
      },
    })

    return new Response(
      JSON.stringify({ url: session.url }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: any) {
    console.error('Error creating checkout session:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})