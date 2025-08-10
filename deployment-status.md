# Edge Functions Deployment Status

## Deployed Functions

The following Supabase Edge Functions have been created/updated and are ready for deployment:

### 1. **createCheckout**
- **File**: `supabase/functions/createCheckout/index.ts`
- **Purpose**: Creates Stripe checkout sessions for single track purchases
- **URL**: `https://dljerhvmrzjwjaphycgx.supabase.co/functions/v1/createCheckout`

### 2. **handle_checkout_webhook**
- **File**: `supabase/functions/handle_checkout_webhook/index.ts` 
- **Purpose**: Processes Stripe webhook events for completed payments (idempotent)
- **URL**: `https://dljerhvmrzjwjaphycgx.supabase.co/functions/v1/handle_checkout_webhook`

### 3. **getSignedUrl**
- **File**: `supabase/functions/getSignedUrl/index.ts`
- **Purpose**: Generates secure download URLs for purchased tracks
- **URL**: `https://dljerhvmrzjwjaphycgx.supabase.co/functions/v1/getSignedUrl`

## Stripe Webhook Configuration

**Webhook Endpoint URL:**
```
https://dljerhvmrzjwjaphycgx.supabase.co/functions/v1/handle_checkout_webhook
```

**Required Events:**
- `checkout.session.completed`

## Supabase Auth Configuration

**Site URL:** `https://www.dld-online.com`
**Redirect URLs:** `https://www.dld-online.com/auth/callback`

## Environment Variables Required

### Frontend (.env):
```
VITE_SUPABASE_URL=https://dljerhvmrzjwjaphycgx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJh...
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_51...
VITE_SITE_URL=https://www.dld-online.com
VITE_FEATURE_NEW_CHECKOUT=true
```

### Supabase Edge Functions:
```
STRIPE_SECRET_KEY=sk_live_51...
STRIPE_WEBHOOK_SECRET=whsec_...
SITE_URL=https://www.dld-online.com
```

## Next Steps

1. Deploy these functions to your Supabase project
2. Configure the webhook URL in your Stripe Dashboard
3. Verify Site URL is set in Supabase Auth settings
4. Test the complete checkout flow

The functions are ready for deployment and will provide detailed error messages for troubleshooting.