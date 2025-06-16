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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { trackId } = await req.json()

    if (!trackId) {
      return new Response(
        JSON.stringify({ error: 'trackId is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    console.log('Processing preview for track:', trackId)

    // Get track details
    const { data: track, error: trackError } = await supabase
      .from('music_tracks')
      .select('*')
      .eq('id', trackId)
      .single()

    if (trackError || !track) {
      return new Response(
        JSON.stringify({ error: 'Track not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      )
    }

    if (!track.audio_full) {
      return new Response(
        JSON.stringify({ error: 'Track has no audio file' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Check if preview already exists
    if (track.preview_url) {
      console.log('Preview already exists for track:', track.title)
      return new Response(
        JSON.stringify({ success: true, preview_url: track.preview_url, message: 'Preview already exists' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Downloading original audio file...')
    
    // Download the original audio file
    const audioResponse = await fetch(track.audio_full)
    if (!audioResponse.ok) {
      throw new Error(`Failed to download audio file: ${audioResponse.statusText}`)
    }

    const audioBuffer = await audioResponse.arrayBuffer()
    const inputFile = `/tmp/input_${trackId}.mp3`
    const outputFile = `/tmp/preview_${trackId}.mp3`

    // Write input file to temp directory
    await Deno.writeFile(inputFile, new Uint8Array(audioBuffer))

    console.log('Creating 30-second preview with FFmpeg...')

    // Use FFmpeg to create 30-second preview
    const ffmpegProcess = new Deno.Command('ffmpeg', {
      args: [
        '-i', inputFile,           // Input file
        '-t', '30',               // Duration: 30 seconds
        '-c:a', 'libmp3lame',     // Audio codec: MP3
        '-b:a', '128k',           // Bitrate: 128kbps
        '-ar', '44100',           // Sample rate: 44.1kHz
        '-ac', '2',               // Channels: Stereo
        '-y',                     // Overwrite output file
        outputFile                // Output file
      ],
      stdout: 'piped',
      stderr: 'piped',
    })

    const { code, stdout, stderr } = await ffmpegProcess.output()

    if (code !== 0) {
      const errorOutput = new TextDecoder().decode(stderr)
      console.error('FFmpeg error:', errorOutput)
      throw new Error(`FFmpeg failed with code ${code}: ${errorOutput}`)
    }

    console.log('Preview created successfully, uploading to storage...')

    // Read the processed preview file
    const previewBuffer = await Deno.readFile(outputFile)

    // Upload preview to Supabase Storage
    const previewFileName = `previews/${trackId}_preview.mp3`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('music')
      .upload(previewFileName, previewBuffer, {
        contentType: 'audio/mpeg',
        upsert: true, // Overwrite if exists
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      throw uploadError
    }

    // Get public URL for the preview
    const { data: { publicUrl } } = supabase.storage
      .from('music')
      .getPublicUrl(uploadData.path)

    console.log('Preview uploaded, updating database...')

    // Update track record with preview URL
    const { error: updateError } = await supabase
      .from('music_tracks')
      .update({ 
        preview_url: publicUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', trackId)

    if (updateError) {
      console.error('Database update error:', updateError)
      throw updateError
    }

    // Clean up temp files
    try {
      await Deno.remove(inputFile)
      await Deno.remove(outputFile)
    } catch (cleanupError) {
      console.warn('Failed to clean up temp files:', cleanupError)
    }

    console.log('Preview generation completed for track:', track.title)

    return new Response(
      JSON.stringify({ 
        success: true, 
        preview_url: publicUrl,
        message: '30-second preview created successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: any) {
    console.error('Preview generation error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Failed to generate 30-second preview'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})