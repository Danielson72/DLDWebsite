// deno-lint-ignore-file no-explicit-any
import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import Stripe from 'https://esm.sh/stripe@14?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2024-06-20' })
const SITE_URL = Deno.env.get('SITE_URL') ?? 'https://www.dld-online.com'

Deno.serve(async (req) => {
  try {
    const { price_id, track_id } = await req.json()
    if (!price_id || !track_id) {
      return new Response(JSON.stringify({ error: 'Missing price_id or track_id' }), { status: 400 })
    }

    // Use the caller's auth to get the Supabase user
    const authHeader = req.headers.get('Authorization') ?? ''
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, // service for metadata insert downstream
      { global: { headers: { Authorization: authHeader } } }
    )
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return new Response(JSON.stringify({ error: 'Unauthenticated' }), { status: 401 })

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: price_id, quantity: 1 }],
      success_url: `${SITE_URL}/library?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/music`,
      metadata: { supabase_uid: user.id, track_id }
    })

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 400 })
  }
})