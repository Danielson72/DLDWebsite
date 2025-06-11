import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client with service role key (bypasses RLS)
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    const { trackId } = await req.json()

    if (!trackId) {
      throw new Error('Track ID is required')
    }

    // First, get the track to find associated files
    const { data: track, error: fetchError } = await supabase
      .from('music_tracks')
      .select('*')
      .eq('id', trackId)
      .single()

    if (fetchError) {
      console.error('Error fetching track:', fetchError)
      throw fetchError
    }

    if (!track) {
      throw new Error('Track not found')
    }

    // Delete associated storage files
    const deletePromises = []
    
    if (track.audio_full) {
      const pathParts = track.audio_full.split('/my-music/')
      if (pathParts.length === 2) {
        const fileKey = decodeURIComponent(pathParts[1])
        deletePromises.push(
          supabase.storage.from('my-music').remove([fileKey])
        )
      }
    }
    
    if (track.audio_preview && track.audio_preview !== track.audio_full) {
      const pathParts = track.audio_preview.split('/my-music/')
      if (pathParts.length === 2) {
        const fileKey = decodeURIComponent(pathParts[1])
        deletePromises.push(
          supabase.storage.from('my-music').remove([fileKey])
        )
      }
    }
    
    if (track.cover_url) {
      const pathParts = track.cover_url.split('/my-music/')
      if (pathParts.length === 2) {
        const fileKey = decodeURIComponent(pathParts[1])
        deletePromises.push(
          supabase.storage.from('my-music').remove([fileKey])
        )
      }
    }

    // Execute storage deletions (ignore errors for missing files)
    const storageResults = await Promise.allSettled(deletePromises)
    
    // Log any storage deletion errors for debugging
    storageResults.forEach((result, index) => {
      if (result.status === 'rejected') {
        console.warn(`Storage deletion ${index} failed:`, result.reason)
      }
    })

    // Delete track record using service role (bypasses RLS)
    const { error: deleteError } = await supabase
      .from('music_tracks')
      .delete()
      .eq('id', trackId)

    if (deleteError) {
      console.error('Database delete error:', deleteError)
      throw deleteError
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error deleting track:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})