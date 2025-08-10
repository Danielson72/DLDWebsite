import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const HARDCODED_STRIPE_PRICE_ID = 'price_1MlFZQGKbDbFMYBRKOBe8Kf4'; // $0.99 price

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    // Verify the user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    const formData = await req.formData()
    const trackData = {
      title: formData.get('title') as string,
      artist: formData.get('artist') as string,
      description: formData.get('description') as string,
      price_cents: parseInt(formData.get('price_cents') as string),
    }

    const audioFile = formData.get('audio_file') as File
    const coverFile = formData.get('cover_file') as File

    // Upload audio file
    let audioUrl = null
    if (audioFile) {
      const audioFileName = `tracks/${Date.now()}-${audioFile.name}`
      const { data: audioUpload, error: audioError } = await supabase.storage
        .from('music')
        .upload(audioFileName, audioFile)

      if (audioError) throw audioError

      const { data: { publicUrl } } = supabase.storage
        .from('music')
        .getPublicUrl(audioUpload.path)
      
      audioUrl = publicUrl
    }

    // Upload cover file
    let coverUrl = null
    if (coverFile) {
      const coverFileName = `covers/${Date.now()}-${coverFile.name}`
      const { data: coverUpload, error: coverError } = await supabase.storage
        .from('music')
        .upload(coverFileName, coverFile)

      if (coverError) throw coverError

      const { data: { publicUrl } } = supabase.storage
        .from('music')
        .getPublicUrl(coverUpload.path)
      
      coverUrl = publicUrl
    }

    // Insert track record with hardcoded Stripe price ID and is_active = true
    const { data: track, error: dbError } = await supabase
      .from('music_tracks')
      .insert({
        ...trackData,
        stripe_price_id: HARDCODED_STRIPE_PRICE_ID, // Hardcoded Stripe price ID
        audio_full: audioUrl,
        audio_preview: audioUrl,
        cover_url: coverUrl,
        cover_image_url: coverUrl,
        user_id: user.id,
        is_active: true, // Explicitly set to true
      })
      .select()
      .single()

    if (dbError) throw dbError

    return new Response(
      JSON.stringify({ success: true, track }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: any) {
    console.error('Upload track error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})