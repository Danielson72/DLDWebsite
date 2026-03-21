# DLD-Online.com — Phase 0 Audit Report
**Date:** 2026-03-21
**Auditor:** Claude Code (Opus 4.6)

---

## 1. Repository State

| Item | Value |
|------|-------|
| **Repo** | github.com/Danielson72/DLDWebsite (PRIVATE) |
| **Local path** | ~/Desktop/dld-online |
| **Framework** | Vite 5.4 + React 18.2 + TypeScript 5.5 |
| **Router** | react-router-dom 6.22 (SPA) |
| **CSS** | Tailwind 3.4 |
| **Deployment** | Netlify (SPA fallback via `dist/`) |
| **Last commit** | `d49dd98` — fix robots.txt/sitemap serving |

**NOTE:** Your Phase 1 instructions say "Convert to Next.js 14 App Router." The existing repo is Vite + React Router. This is a **full framework migration**, not a simple component conversion. Need your decision:
- **Option A:** Migrate to Next.js 14 App Router (fresh setup, re-use components)
- **Option B:** Stay on Vite + React Router, apply Stitch design as-is

---

## 2. Current Project Structure

```
dld-online/
├── index.html              # SPA entry (has SEO meta, OG tags)
├── vite.config.ts
├── tailwind.config.js       # Minimal — matrix-rain animation only
├── netlify.toml             # build: npm run build → dist/
├── package.json             # Vite + React + Stripe + Supabase + wavesurfer
├── src/
│   ├── App.tsx              # BrowserRouter with 14 routes
│   ├── main.tsx
│   ├── index.css
│   ├── stripe-config.ts
│   ├── components/
│   │   ├── Layout.tsx       # Nav + Footer wrapper (glass-style, auth-aware)
│   │   ├── Footer.tsx
│   │   ├── PageHero.tsx
│   │   ├── ProductCard.tsx
│   │   ├── StripeCheckout.tsx
│   │   ├── SubscriptionStatus.tsx
│   │   ├── UserAvatar.tsx
│   │   ├── auth/            # Auth modal components
│   │   ├── music/           # Music player components
│   │   └── Dashboard/       # Dashboard widgets
│   ├── pages/               # 15 page components
│   │   ├── Home.tsx         # Hero-only (single image, matrix bg)
│   │   ├── About.tsx
│   │   ├── Music.tsx        # Music store with Stripe checkout
│   │   ├── Services.tsx     # Church services/events (placeholder?)
│   │   ├── Ministry.tsx
│   │   ├── YouTube.tsx
│   │   ├── Contact.tsx
│   │   ├── Login.tsx / Register.tsx
│   │   ├── Dashboard.tsx
│   │   ├── MusicUpload.tsx  # Admin: upload tracks
│   │   ├── MyMusic.tsx      # User: purchased music
│   │   └── Success.tsx      # Stripe success page
│   ├── lib/
│   │   ├── supabase.ts      # Supabase client
│   │   ├── stripe.ts        # Stripe helpers
│   │   ├── checkout.ts      # Checkout flow
│   │   └── useAdminFlag.ts  # Admin role check
│   └── types/
├── public/
│   ├── images/dld-hero.png  # ✅ JUST COPIED (1.5MB)
│   ├── og/                  # OG image
│   ├── robots.txt
│   ├── sitemap.xml
│   └── [4 large PNG assets] # ChatGPT-generated images (~11MB total)
├── supabase/
│   ├── functions/           # 13 Edge Functions (Stripe checkout/webhooks)
│   └── migrations/          # 24 migrations
└── _redirects               # Netlify SPA fallback
```

---

## 3. Supabase Database (Project: DLD.COM)

| Table | Rows | RLS | Purpose |
|-------|------|-----|---------|
| `music_tracks` | 8 | ✅ | Music catalog (title, artist, price, audio URLs, Stripe price ID) |
| `user_profiles` | 1 | ✅ | User display names, avatars |
| `purchases` | 0 | ✅ | Track purchases (Stripe session tracking) |
| `resources` | 0 | ✅ | Downloadable files linked to tracks |
| `stripe_customers` | 0 | ✅ | Stripe customer ↔ user mapping |
| `stripe_subscriptions` | 0 | ✅ | Subscription tracking |
| `stripe_orders` | 0 | ✅ | Order history |
| `open_brain_memory` | 10 | ✅ | AI memory system (cross-business) |
| `open_brain_episodes` | 0 | ✅ | AI session episodes |
| `open_brain_sessions` | 0 | ✅ | AI session tracking |

**Artists allowed:** DLD, The Tru Witnesses, Waves From IAM

---

## 4. Edge Functions (13 total)

Stripe-related: `create-checkout`, `create-checkout-session`, `createCheckout`, `stripe-checkout`, `stripe-webhook`, `handle-checkout-webhook`, `handle-webhook`, `handle_checkout_webhook`
Track management: `delete-track`, `upload-track`, `get-signed-url`, `getSignedUrl`, `make-preview`

**Note:** Multiple duplicate/overlapping checkout and webhook functions — likely from iterative development. Should consolidate.

---

## 5. Current Design System

| Element | Current | Stitch Target |
|---------|---------|---------------|
| **Primary dark** | `black` (#000) | Dark teal-green |
| **Accent 1** | `amber-500` (#F59E0B) | Gold (exact values TBD from Stitch) |
| **Accent 2** | `green-500` (#22C55E) | — |
| **Fonts** | System defaults | Newsreader (headlines) + Manrope (body) |
| **Nav style** | Glass blur (black/60) | Glass nav (Stitch) |
| **Icons** | Lucide React | Material Symbols |
| **Hero** | Single image, matrix bg | Gradient overlay + hero image |

---

## 6. Dependencies

**Keep (core):**
- react, react-dom, react-router-dom
- @supabase/supabase-js
- @stripe/stripe-js, stripe
- tailwindcss
- lucide-react (may swap to Material Symbols per Stitch)
- wavesurfer.js (music player)

**Add (for Stitch design):**
- Google Fonts: Newsreader + Manrope
- Material Symbols (CDN or npm)

---

## 7. Hero Image

| Item | Status |
|------|--------|
| Source | `~/Downloads/dld_cinematic_hero_screen_1.png` |
| Destination | `public/images/dld-hero.png` ✅ copied |
| Size | 1.5 MB |
| WebP conversion | Pending (need sharp-cli) |

---

## 8. Critical Decision Needed

**The prompt says "Convert this HTML into Next.js 14 App Router"** but the existing repo is **Vite + React Router** with working Stripe checkout, Supabase auth, music player, and 13 Edge Functions.

### Recommendation: Stay on Vite + React Router

**Why:**
1. Working music store + Stripe payments already wired
2. 13 Edge Functions already deployed
3. Netlify SPA deployment already configured
4. No SSR/SSG needed for this content
5. Migration risk is high for no clear benefit
6. Stitch HTML can be applied as React components either way

**If you want Next.js:** We'd need a fresh `npx create-next-app`, port all 15 pages, re-wire Supabase SSR, update Netlify config, and potentially rebuild Edge Function integrations.

---

## 9. Stitch HTML Files

**NOT FOUND** in Downloads. Only found Stitch files for Boss of Clean:
- `stitch_modernized_boss_of_clean_landing_page.zip`

**I need the DLD Stitch HTML output files to proceed with Phase 1.** Please provide:
1. The Stitch homepage HTML
2. The Stitch software dev page HTML

---

## 10. Ready Status

| Prereq | Status |
|--------|--------|
| Repo cloned | ✅ |
| Project structure audited | ✅ |
| Supabase connected (MCP) | ✅ |
| Supabase tables documented | ✅ |
| Hero image copied | ✅ |
| Stitch HTML files located | ❌ MISSING |
| Framework decision | ⏳ Awaiting your call |
| .env.local created | ⏳ Will create after decision |
