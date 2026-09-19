<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# ArtBlush — Project Memory (auto-loaded by AI coding agents)

Hand-drawn portrait / charcoal art brand. 'Art, Drawn With Feeling'. Read this
before making any changes; update it as the project evolves.

## Status: Phase 2 IN PROGRESS (buy-now flow built, NOT deployed/configured yet)

Phase 1 (static premium gallery) is COMPLETE and LIVE. Phase 2 (marketplace:
shop/cart/checkout via Razorpay, no accounts yet) is coded but pending the
DATABASE_URL + Razorpay keys from the owner before it can go live.

- **Production:** https://www.artblush.in (apex https://artblush.in 308-redirects here)
- **Backup URL:** https://artblush.vercel.app
- **GitHub:** https://github.com/amoghp02/artblush (public, branch `main`)
- **Repo on disk:** `C:\artblush`
- **Vercel project:** `artblush` under scope `amogh-dev`
- **Auto-deploy:** every `git push` to `main` deploys (GitHub ↔ Vercel integration).
  Local manual alt: `vercel --prod`.

## Accounts (user-owned, NOT in chat history secrets)

- GitHub: `amoghp02` (authorized via gh CLI on this machine)
- Vercel: `amogh-dev` / creator `amoghprakash02` (login via CLI on this machine)
- GoDaddy: owns `artblush.in` (registrar; DNS hosted at GoDaddy nameservers
  ns47/ns48.domaincontrol.com — records point at Vercel, do NOT switch NS)
- Instagram: `https://www.instagram.com/_artblush_` (linked in Footer + Contact)
- Neon (Postgres): OWNER must create a project + DB, then provide DATABASE_URL
- Razorpay: OWNER must create account, provide RAZORPAY_KEY_ID + RAZORPAY_KEY_SECRET

## Domain / DNS (GoDaddy)

- `A     @    76.76.21.21`            (Vercel apex)
- `CNAME www  cname.vercel-dns.com`  (Vercel)
- SSL auto-provisioned by Vercel (Let's Encrypt). apex → www redirect is correct.

## Phase 2 data/architecture

- **Schema** `db/schema.ts`: `artworks`, `cart_items` (unique session+artwork),
  `orders`, `order_items`. Prices stored in PAISE (Razorpay convention).
- **DB access** `db/index.ts` (`getDb` lazy singleton, `isDatabaseConfigured()`);
  `lib/data.ts` is a data seam — DB-backed when DATABASE_URL set, else falls back to
  the static array in `lib/artworks.ts` so builds/deploy work without a DB.
- **Cart** `lib/cart/server.ts` (cookie `artblush_cart`, UUID), actions in
  `lib/cart/actions.ts`, Header badge `components/CartNavLink.tsx` (client,
  listens for `cart-updated` window event; mutations dispatch it).
- **Checkout** `app/checkout/`: page (server, reads cart) + `CheckoutForm.tsx`
  (client, address → `createCheckoutOrder` action → Razorpay checkout.js modal →
  `confirmPaidOrder` → redirect `/checkout/success`). Order stored as `created`,
  webhook promotes to `paid`.
- **Razorpay** `lib/razorpay/server.ts`: order creation (server-only secrets),
  payment-signature verify, webhook-signature verify. Webhook route:
  `app/api/razorpay/webhook/route.ts` (x-razorpay-signature HMAC check).
- **Seed** `db/seed.ts` with placeholder prices (marked in-file as stand-ins).
- Read-only pages still fall back to the static array when DB absent.

## Pages/routes (Phase 2 additions)

- `/cart` (dynamic), `/checkout` (dynamic), `/checkout/success` (dynamic),
  `/api/razorpay/webhook` (POST). sitemap updated with /cart + /checkout.

## Environment / toolchain on this machine

- Windows (PowerShell 5.1). Git 2.55 + GitHub CLI installed; note: git/gh may need
  PATH refresh in a fresh shell; gh.exe at `C:\Program Files\GitHub CLI\gh.exe`.
- Node v24, Next.js 16 (App Router + Turbopack), React 19, Tailwind v4.
- Design tokens in `app/globals.css` (ivory `#f4efe6`, ink `#1f1b15`, clay `#9b6b43`).
- Added deps: `drizzle-orm`, `drizzle-kit` (dev), `@neondatabase/serverless`,
  `razorpay`, `tsx` (dev).
- `.env.local` + Vercel env vars needed: DATABASE_URL, RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET, RAZORPAY_WEBHOOK_SECRET (optional). See `.env.example`.

## Verification commands

```bash
npm run lint      # ESLint
npm run build     # production build (passes without DATABASE_URL via fallback)
git push          # auto-deploys to Vercel
# Once DATABASE_URL exists:
npm run db:push   # push schema to Neon
npm run db:seed   # seed the 12 artworks
```

Important: `/cart`, `/checkout` must remain DYNAMIC (they read the cookie) — they
are marked okay because `getCartLines` reads `cookies()` before its DB guard.
Keep that ordering if you touch `lib/cart/server.ts`.

## Placeholder / TODO (phase-gating)

- [ ] OWNER: create Neon project → commit DATABASE_URL to Vercel env + .env.local
- [ ] OWNER: create Razorpay account → set RAZORPAY_KEY_ID/SECRET (+ webhook secret)
- [ ] Configure Razorpay webhook to point at https://www.artblush.in/api/razorpay/webhook (payment.captured)
- [ ] Confirm/replace placeholder artwork prices before real launch
- [ ] Replace contact email placeholder
- [ ] Replace Unsplash artwork images with real ArtBlush art
- [ ] og:image for social previews (needs a real artwork asset)
- [ ] Phase 3: customer accounts, order history, admin dashboard, inventory,
      commissions, shipping
- [ ] Phase 4: commission builder, progress tracking, certificates, wishlist
