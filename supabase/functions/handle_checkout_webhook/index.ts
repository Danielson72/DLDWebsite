// deno-lint-ignore-file no-explicit-any
import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import Stripe from 'https://esm.sh/stripe@14?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2024-06-20' })
const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

Deno.serve(async (req) => {
  const sig = req.headers.get('stripe-signature')
  const secret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!
  let event
  try {
    const body = await req.text()
    event = stripe.webhooks.constructEvent(body, sig!, secret)
  } catch (err) {
    return new Response(`Webhook signature verification failed: ${err}`, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const s = event.data.object as any
    const uid = s.metadata?.supabase_uid
    const track_id = s.metadata?.track_id
    if (uid && track_id) {
      // Upsert purchase (idempotent)
      await supabase.from('purchases').upsert({
        user_id: uid,
        track_id,
        status: 'paid',
        stripe_session_id: s.id
      }, { onConflict: 'user_id,track_id' })
    }
  }
  return new Response('ok', { status: 200 })
})