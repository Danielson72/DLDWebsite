import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get user from auth header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    const url = new URL(req.url)
    const trackId = url.searchParams.get('track_id')

    if (!trackId) {
      return new Response(
        JSON.stringify({ error: 'track_id parameter required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Verify user has purchased this track
    const { data: purchase, error: purchaseError } = await supabase
      .from('purchases')
      .select(`
        *,
        music_tracks!inner (
          id,
          title,
          artist,
          audio_full
        )
      `)
      .eq('user_id', user.id)
      .eq('track_id', trackId)
      .eq('status', 'paid')
      .single()

    if (purchaseError || !purchase) {
      return new Response(
        JSON.stringify({ error: 'Purchase not found or not completed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
      )
    }

    const track = purchase.music_tracks
    if (!track.audio_full) {
      return new Response(
        JSON.stringify({ error: 'Track file not available' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      )
    }

    // Extract file path from the full URL
    const audioUrl = track.audio_full
    const pathParts = audioUrl.split('/music/')
    if (pathParts.length !== 2) {
      return new Response(
        JSON.stringify({ error: 'Invalid file path' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const filePath = decodeURIComponent(pathParts[1])

    // Create signed URL for download (valid for 1 hour)
    const { data: signedUrlData, error: urlError } = await supabase.storage
      .from('music')
      .createSignedUrl(filePath, 3600, {
        download: true,
      })

    if (urlError || !signedUrlData) {
      console.error('Error creating signed URL:', urlError)
      return new Response(
        JSON.stringify({ error: 'Failed to create download link' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    return new Response(
      JSON.stringify({ 
        download_url: signedUrlData.signedUrl,
        filename: `${track.artist} - ${track.title}.mp3`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: any) {
    console.error('Error in get-signed-url:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})