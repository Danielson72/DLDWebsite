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
    // Check for required environment variables
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')

    console.log('Environment check:', {
      hasStripeKey: !!stripeSecretKey,
    })

    if (!stripeSecretKey) {
      console.error('STRIPE_SECRET_KEY environment variable is not set')
      return new Response(
        JSON.stringify({ 
          error: 'STRIPE_SECRET_KEY environment variable is not set',
          details: 'Please configure the STRIPE_SECRET_KEY in your Supabase Edge Function settings'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      )
    }

    // Use the built-in Supabase environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || 'http://localhost:54321'
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseServiceKey) {
      console.error('SUPABASE_SERVICE_ROLE_KEY environment variable is not set')
      return new Response(
        JSON.stringify({ 
          error: 'SUPABASE_SERVICE_ROLE_KEY environment variable is not set',
          details: 'This should be automatically available in Supabase Edge Functions'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      )
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { default: Stripe } = await import('npm:stripe@14.25.0')
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
    })

    const { trackId } = await req.json()

    if (!trackId) {
      console.error('Track ID is required but not provided')
      return new Response(
        JSON.stringify({ 
          error: 'Track ID is required',
          details: 'Please provide a valid track ID'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    console.log('Fetching track with ID:', trackId)

    // Fetch track from Supabase using the client
    const { data: tracks, error: fetchError } = await supabase
      .from('music_tracks')
      .select('*')
      .eq('id', trackId)

    if (fetchError) {
      console.error('Failed to fetch track:', fetchError)
      return new Response(
        JSON.stringify({ 
          error: `Failed to fetch track: ${fetchError.message}`,
          details: fetchError.details || 'Database query failed'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      )
    }

    const track = tracks?.[0]

    if (!track) {
      console.error('Track not found with ID:', trackId)
      return new Response(
        JSON.stringify({ 
          error: 'Track not found',
          details: `No track found with ID: ${trackId}`
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404,
        }
      )
    }

    console.log('Creating Stripe checkout session for track:', track.title)

    // Get the origin from the request headers, fallback to localhost for development
    const origin = req.headers.get('origin') || 'http://localhost:5173'

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
      success_url: `${origin}/music?success=true&track=${trackId}`,
      cancel_url: `${origin}/music?canceled=true`,
      metadata: {
        trackId: trackId,
      },
    })

    console.log('Checkout session created successfully:', session.id)

    return new Response(
      JSON.stringify({ url: session.url }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error creating checkout session:', error)
    
    // Provide more specific error messages based on the error type
    let errorMessage = error.message
    let statusCode = 500
    
    if (error.message?.includes('Invalid API Key')) {
      errorMessage = 'Invalid Stripe API key configuration'
      statusCode = 500
    } else if (error.message?.includes('No such')) {
      errorMessage = 'Stripe resource not found'
      statusCode = 404
    }
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: 'Check the Edge Function logs for more details. Ensure all required environment variables are set in Supabase Edge Functions settings.'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: statusCode,
      }
    )
  }
})