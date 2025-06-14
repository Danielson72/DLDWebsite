# Music Marketplace Deployment Guide

## 1. Supabase CLI Setup

First, install and configure the Supabase CLI:

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project (replace with your actual project reference)
supabase link --project-ref dljerhvmrzjwjaphycgx
```

## 2. Environment Variables Setup

Go to your Supabase Dashboard → Settings → Edge Functions → Environment Variables and add:

```
SUPABASE_URL=https://dljerhvmrzjwjaphycgx.supabase.co
SUPABASE_ANON_KEY=eyJh...your-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJh...your-service-role-key
STRIPE_SECRET_KEY=sk_live_51...your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_...your-webhook-secret
```

## 3. Deploy Edge Functions

Deploy all the Edge Functions:

```bash
# Deploy the checkout session function
supabase functions deploy create-checkout-session

# Deploy the upload track function
supabase functions deploy upload-track

# Deploy the delete track function  
supabase functions deploy delete-track

# Deploy the webhook handler
supabase functions deploy handle-webhook
```

## 4. Storage Bucket Setup

In your Supabase Dashboard:

1. Go to **Storage** → **Buckets**
2. Create a bucket named `music` (if it doesn't exist)
3. Set it as **Public bucket**
4. Set **File size limit** to 50MB
5. Add **Allowed MIME types**:
   - `audio/mpeg`
   - `audio/wav` 
   - `audio/mp3`
   - `audio/m4a`
   - `audio/aac`
   - `audio/ogg`
   - `audio/flac`
   - `image/jpeg`
   - `image/png`
   - `image/webp`
   - `image/gif`

## 5. Storage Policies

In **Storage** → **Policies**, create these policies for the `music` bucket:

### Policy 1: Allow authenticated uploads
- **Policy name**: "Allow authenticated uploads to music bucket"
- **Operation**: INSERT
- **Target roles**: authenticated
- **Policy definition**: `true`

### Policy 2: Allow authenticated deletes  
- **Policy name**: "Allow authenticated deletes from music bucket"
- **Operation**: DELETE
- **Target roles**: authenticated
- **Policy definition**: `true`

### Policy 3: Allow public downloads
- **Policy name**: "Allow public downloads from music bucket"
- **Operation**: SELECT
- **Target roles**: public
- **Policy definition**: `true`

## 6. Database Migration

The database migration has already been applied. It includes:

- ✅ Enhanced `music_tracks` table with Stripe integration
- ✅ `user_profiles` table for extended user data
- ✅ `purchases` table for tracking sales
- ✅ `resources` table for downloadable content
- ✅ Row Level Security policies
- ✅ Performance indexes
- ✅ Your 3 real music tracks with correct Stripe Price IDs

## 7. Stripe Webhook Configuration

1. Go to your **Stripe Dashboard** → **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Set **Endpoint URL** to: `https://dljerhvmrzjwjaphycgx.supabase.co/functions/v1/handle-webhook`
4. Select events to listen for:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
5. Copy the **Signing secret** and add it as `STRIPE_WEBHOOK_SECRET` in your Supabase environment variables

## 8. Admin User Setup

Create an admin user account:

```javascript
// Run this in your browser console or create a script
const { data, error } = await supabase.auth.admin.createUser({
  email: 'danielinthelionsden72@gmail.com',
  password: 'Yah14472',
  email_confirm: true,
  user_metadata: { role: 'admin' }
})
```

## 9. Frontend Environment Variables

Update your `.env` file:

```
VITE_SUPABASE_URL=https://dljerhvmrzjwjaphycgx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJh...your-anon-key
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_51...your-publishable-key
VITE_ADMIN_EMAIL=danielinthelionsden72@gmail.com
```

## 10. Test the Complete Flow

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Test as admin**:
   - Sign in with your admin email
   - Upload/delete tracks
   - Upload custom artwork for each track

3. **Test as customer**:
   - Sign in with a different email
   - Browse tracks
   - Purchase a track via Stripe Checkout
   - Verify purchase is recorded in the database

## 11. Production Deployment

When ready for production:

1. **Build your app**:
   ```bash
   npm run build
   ```

2. **Deploy to your hosting provider** (Netlify, Vercel, etc.)

3. **Update Stripe webhook URL** to point to your production domain

4. **Test the complete purchase flow** in production

## Troubleshooting

- **Edge Function errors**: Check the Supabase Edge Function logs
- **Storage upload issues**: Verify bucket policies are correctly set
- **Stripe checkout errors**: Ensure Price IDs are for one-time payments, not subscriptions
- **Authentication issues**: Check RLS policies and user permissions

Your music marketplace is now fully configured and ready for business! 🎵