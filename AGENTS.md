<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# ArtBlush — Project Memory (auto-loaded by AI coding agents)

Hand-drawn portrait / charcoal art brand. 'Art, Drawn With Feeling'. Read this
before making any changes; update it as the project evolves.

## Status: Phase 2 LIVE + customer accounts + modern UX DEPLOYED

Phase 1 (static premium gallery) is LIVE. Phase 2 marketplace (Neon/Drizzle catalog,
cookie cart, Razorpay Standard Checkout) + customer accounts are fully deployed.
Login is REQUIRED for checkout. A modern UX pass is also live: wishlist, account
avatar menu, toasts, checkout steps, order timeline, back-to-top, share, testimonials.
Razorpay TEST keys are armed — real-money launch needs live keys + real pricing.

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
- Neon (Postgres): configured — DATABASE_URL in `.env.local` + Vercel production
  env. Schema pushed, 12 artworks seeded (8 saleable, placeholder prices).
- Razorpay: TEST keys armed (RAZORPAY_KEY_ID + RAZORPAY_KEY_SECRET in `.env.local`
  + Vercel production env as Secrets). Order creation + payment-signature verify
  tested against the live test API. Webhook NOT yet registered on the Razorpay
  dashboard (optional for now; the checkout modal handlers confirm payments.
  If registering a webhook, set RAZORPAY_WEBHOOK_SECRET too).

## Domain / DNS (GoDaddy)

- `A     @    76.76.21.21`            (Vercel apex)
- `CNAME www  cname.vercel-dns.com`  (Vercel)
- SSL auto-provisioned by Vercel (Let's Encrypt). apex → www redirect is correct.

## Phase 2 data/architecture

- **Schema** `db/schema.ts`: `artworks`, `cart_items` (unique session+artwork),
  `wishlist_items` (unique session+artwork), `users`, `sessions` (token PK, FK user,
  expiry), `orders` (FK `userId`), `order_items`.
  Prices stored in PAISE (Razorpay convention).
- **Auth** `lib/auth/` — custom, no third-party auth lib:
  - `password.ts`: bcryptjs (hash cost 12, server-only)
  - `session.ts`: DB-backed session token in `artblush_session` cookie (30-day TTL,
    httpOnly/lax/secure-in-prod); `getCurrentUser`, `requireUser(next?)` (redirects).
  - `actions.ts`: `signUp`/`login`/`logout`/`updateProfile` (form-action compatible,
    returns `{error}` state, calls `redirect()` on success) using React `useActionState`.
  - **Login is required for checkout** — `app/checkout/page.tsx` + `createCheckoutOrder`
    guard via `requireUser`/`getCurrentUser`; the checkout form prefills the user.
- **Account** `app/account/` (layout guards via `requireUser`, tabs in layout):
  `/account` overview + recent orders, `/account/orders` history, `/account/orders/[id]`
  detail, `/account/profile` name/phone edit (email immutable).
  Order queries: `lib/orders.ts` (`getOrdersForUser`, `getOrderForUser`, status labels).
- **Wishlist** `lib/wishlist/` + `/wishlist` page — session-cookie based (reuses the
  cart session cookie `artblush_cart`, works for guests too). Heart button on
  `ArtworkCard` + artwork detail; `component/WishlistButton.tsx` optimistic toggle +
  dispatches `wishlist-updated` event (header badge listens). DB table `wishlist_items`.
- **Modern UX components**: `AccountMenu` (avatar initials in header, dropdown:
  dashboard/orders/profile/sign-out; reads `/api/me`, listens for `auth-updated`),
  `Toaster` (Listens `artblush-toast` CustomEvent from `lib/toast.ts`; shown on
  add-to-cart/wishlist/copied-link), `CheckoutSteps` (Bag → Details & Payment →
  Confirmation on cart/checkout/success), `OrderStatusTimeline` (order detail),
  `BackToTop` (root layout), `ShareLinks` (copy link / WhatsApp / native share on
  artwork detail), `Testimonials` (home page — **placeholder quotes, replace before
  launch**). Badge pop + toast keyframes live in `app/globals.css`.
- **Razorpay** `lib/razorpay/server.ts`: order creation + signature verification.
  `app/checkout/CheckoutForm.tsx` opens the checkout.js modal (created order via
  server action, `confirmPaidOrder` verifies the payment signature server-side).
  Webhook route at `app/api/razorpay/webhook`.
- **DB access** `db/index.ts` (`getDb` lazy singleton, `isDatabaseConfigured()`);
  `lib/data.ts` falls back to the static array in `lib/artworks.ts` when no DB.

## Pages/routes (Phase 2 additions)

- `/login`, `/signup` (searchParams `next` honored, action returns to it),
  `/account` (+ `/orders`, `/orders/[id]`, `/profile`) — all login-guarded.
- `/cart` (dynamic), `/checkout` (dynamic, login required), `/checkout/success`,
  `/wishlist` (dynamic — reads the cart session cookie), `/api/me` (GET, session-aware),
  `/api/razorpay/webhook` (POST). sitemap updated.
- NOTE: root layout does NOT read the session — only protected pages do, so public
  marketing routes stay prerenderable. If you add session reads to the root layout
  everything becomes dynamic.

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

- [ ] Swap placeholder artwork prices for real studio pricing before real-money launch
- [ ] Optionally register Razorpay webhook (https://www.artblush.in/api/razorpay/webhook, payment.captured) + set RAZORPAY_WEBHOOK_SECRET
- [ ] Replace LIVE Razorpay keys when going into production
- [ ] Replace contact email placeholder
- [ ] Replace Unsplash artwork images with real ArtBlush art
- [ ] Replace placeholder Testimonials quotes with real collector words
- [ ] og:image for social previews (needs a real artwork asset)
- [ ] Phase 3: customer accounts admin panel, order mgmt, commissions, shipping
- [ ] Phase 4: commission builder, progress tracking, certificates
