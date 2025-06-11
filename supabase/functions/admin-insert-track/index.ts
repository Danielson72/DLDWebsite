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

    const {
      title,
      artist,
      description,
      price_cents,
      audio_full,
      audio_preview,
      user_id
    } = await req.json()

    // Validate required fields
    if (!title || !artist || !audio_full || !user_id) {
      throw new Error('Missing required fields')
    }

    // Insert track using service role (bypasses RLS)
    const { data, error } = await supabase
      .from('music_tracks')
      .insert({
        title,
        artist,
        description,
        price_cents: price_cents || 0,
        audio_full,
        audio_preview,
        user_id
      })
      .select()

    if (error) {
      console.error('Database insert error:', error)
      throw error
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error inserting track:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})