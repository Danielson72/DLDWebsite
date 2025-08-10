// deno-lint-ignore-file no-explicit-any
import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const BUCKET = 'music' // keep your actual bucket name

Deno.serve(async (req) => {
  try {
    const { track_id } = await req.json()
    const authHeader = req.headers.get('Authorization') ?? ''
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return new Response(JSON.stringify({ error: 'Unauthenticated' }), { status: 401 })

    // Verify purchase
    const { data: ok } = await supabase.from('purchases')
      .select('id').eq('user_id', user.id).eq('track_id', track_id).eq('status', 'paid').maybeSingle()
    if (!ok) return new Response(JSON.stringify({ error: 'Not purchased' }), { status: 403 })

    // Find file path from music_tracks
    const { data: trk, error } = await supabase.from('music_tracks')
      .select('audio_full').eq('id', track_id).maybeSingle()
    if (error || !trk?.audio_full) return new Response(JSON.stringify({ error: 'File not found' }), { status: 404 })

    // Extract file path from full URL
    const audioUrl = trk.audio_full
    const pathParts = audioUrl.split('/music/')
    if (pathParts.length !== 2) {
      return new Response(JSON.stringify({ error: 'Invalid file path' }), { status: 400 })
    }
    const filePath = decodeURIComponent(pathParts[1])

    const { data: signed } = await supabase.storage.from(BUCKET).createSignedUrl(filePath, 60 * 5)
    return new Response(JSON.stringify({ url: signed?.signedUrl }), { headers: { 'Content-Type':'application/json' }})
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 400 })
  }
})