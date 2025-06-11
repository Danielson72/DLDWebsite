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
    // Check for required environment variables
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!stripeSecretKey) {
      throw new Error('STRIPE_SECRET_KEY environment variable is not set')
    }
    if (!supabaseUrl) {
      throw new Error('SUPABASE_URL environment variable is not set')
    }
    if (!supabaseServiceKey) {
      throw new Error('SUPABASE_SERVICE_ROLE_KEY environment variable is not set')
    }

    const { default: Stripe } = await import('npm:stripe@14.21.0')
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
    })

    const { trackId } = await req.json()

    if (!trackId) {
      throw new Error('Track ID is required')
    }

    // Fetch track from Supabase
    const supabaseResponse = await fetch(`${supabaseUrl}/rest/v1/music_tracks?id=eq.${trackId}`, {
      headers: {
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey,
        'Content-Type': 'application/json',
      },
    })

    if (!supabaseResponse.ok) {
      throw new Error(`Failed to fetch track: ${supabaseResponse.status} ${supabaseResponse.statusText}`)
    }

    const tracks = await supabaseResponse.json()
    const track = tracks[0]

    if (!track) {
      throw new Error('Track not found')
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: track.title,
              description: `${track.artist} - ${track.description || 'Digital Music Track'}`,
              images: track.cover_url ? [track.cover_url] : [],
            },
            unit_amount: track.price_cents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/music?success=true&track=${trackId}`,
      cancel_url: `${req.headers.get('origin')}/music?canceled=true`,
      metadata: {
        trackId: trackId,
      },
    })

    return new Response(
      JSON.stringify({ url: session.url }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Check that all required environment variables are set in Supabase Edge Functions settings'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})