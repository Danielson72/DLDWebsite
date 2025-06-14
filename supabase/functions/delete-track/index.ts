import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, DELETE, OPTIONS',
}

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

    const { trackId } = await req.json()

    if (!trackId) {
      return new Response(
        JSON.stringify({ error: 'Track ID is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Get track details first
    const { data: track, error: fetchError } = await supabase
      .from('music_tracks')
      .select('*')
      .eq('id', trackId)
      .single()

    if (fetchError || !track) {
      return new Response(
        JSON.stringify({ error: 'Track not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      )
    }

    // Delete storage files
    const deletePromises = []
    
    if (track.audio_full) {
      const pathParts = track.audio_full.split('/music/')
      if (pathParts.length === 2) {
        const fileKey = decodeURIComponent(pathParts[1])
        deletePromises.push(
          supabase.storage.from('music').remove([fileKey])
        )
      }
    }
    
    if (track.audio_preview && track.audio_preview !== track.audio_full) {
      const pathParts = track.audio_preview.split('/music/')
      if (pathParts.length === 2) {
        const fileKey = decodeURIComponent(pathParts[1])
        deletePromises.push(
          supabase.storage.from('music').remove([fileKey])
        )
      }
    }
    
    if (track.cover_url) {
      const pathParts = track.cover_url.split('/music/')
      if (pathParts.length === 2) {
        const fileKey = decodeURIComponent(pathParts[1])
        deletePromises.push(
          supabase.storage.from('music').remove([fileKey])
        )
      }
    }

    if (track.cover_image_url) {
      const pathParts = track.cover_image_url.split('/music/')
      if (pathParts.length === 2) {
        const fileKey = decodeURIComponent(pathParts[1])
        deletePromises.push(
          supabase.storage.from('music').remove([fileKey])
        )
      }
    }

    // Execute storage deletions (ignore errors for missing files)
    await Promise.allSettled(deletePromises)

    // Delete database record
    const { error: deleteError } = await supabase
      .from('music_tracks')
      .delete()
      .eq('id', trackId)

    if (deleteError) throw deleteError

    return new Response(
      JSON.stringify({ success: true, message: 'Track deleted successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: any) {
    console.error('Delete track error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})