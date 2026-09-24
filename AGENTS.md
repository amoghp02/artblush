<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# ArtBlush — Project Memory (auto-loaded by AI coding agents)

Hand-drawn portrait / charcoal art brand. 'Art, Drawn With Feeling'. Read this
before making any changes; update it as the project evolves.

## Status: LIVE — P1/P2 done, Phase 3 (studio admin + shipping) built, emails armed-when-keyed

Phase 1 (static premium gallery) is LIVE. Phase 2 marketplace (Neon/Drizzle catalog,
cookie cart, Razorpay Standard Checkout) + customer accounts + a modern UX pass
(wishlist, avatar menu, toasts, checkout steps, order timeline, back-to-top, share,
testimonials) are fully deployed. The catalog now uses the owner's REAL artwork
photos (8 pieces, all saleable, placeholder pricing). Login is REQUIRED for checkout.
Razorpay TEST keys are armed — real-money launch needs live keys + real studio pricing.
Sold/inventory tracking auto-flags pieces on paid orders. Phase 3 added: a studio
ADMIN dashboard (/admin — orders, artworks, commissions), shipping & tracking
(states + tracking number + customer timeline + shipment email), and the contact
form now persists enquiries into the `commissions` table fed to the admin list.
Resend order emails are wired but need RESEND_API_KEY + verified sender/recipient.

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
  env. Schema pushed, 8 artworks seeded (real photos, all saleable).
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

- **Catalog**: 8 REAL artworks (owner's own photos), all saleable at placeholder
  studio pricing (₹4,500–7,000). Source list: `lib/artworks.ts` (ids: laugh-lines,
  those-eyes-those-curls, first-smile, pure-delight, beneath-the-skin, the-rider,
  with-a-bow, pensive). Photos live in `/public/portfolio-photos/*` and are stored
  in the DB `artworks.image` as local paths (`/portfolio-photos/<id>.png|jpg`).
  `components/ArtworkImage.tsx` renders local paths with `next/image` (no grayscale
  filter, no remote patterns in next.config). `assets/portfolio-photos/` holds the
  raw uploads (copy new photos there → rename to the artwork id slug → copy into
  `public/portfolio-photos/` → update DB row if id/order changes).
- **Schema** `db/schema.ts`: `artworks` (incl. `sold` bool — one-of-one inventory flag),
  `cart_items` (unique session+artwork),
  `wishlist_items` (unique session+artwork), `users` (role admin/customer, saved address),
  `sessions` (token PK, FK user, expiry), `orders` (FK `userId`; also shipping_status
  awaiting_shipment/shipped/delivered/returned + tracking_number/carrier + shipped/
  delivered timestamps), `order_items`, `commissions` (name/email/phone/enquiryType/
  message + status new/contacted/in_progress/completed/declined + admin note; fed by
  the /contact form).
  Prices stored in PAISE (Razorpay convention).
- **Auth** `lib/auth/` — custom, no third-party auth lib:
  - `password.ts`: bcryptjs (hash cost 12, server-only)
  - `session.ts`: DB-backed session token in `artblush_session` cookie (30-day TTL,
    httpOnly/lax/secure-in-prod); `getCurrentUser`, `requireUser(next?)` (redirects).
  - `actions.ts`: `signUp`/`login`/`logout`/`updateProfile` (form-action compatible,
    returns `{error}` state, calls `redirect()` on success) using React `useActionState`.
  - `updateProfile` also saves the user's delivery ADDRESS (users table has
    address_line_1/2, city, state, postal_code; PIN must be 6 digits; blank = clear).
  - **Login is required for checkout** — `app/checkout/page.tsx` + `createCheckoutOrder`
    guard via `requireUser`/`getCurrentUser`; the checkout form prefills the user
    incl. saved address, and the used address auto-saves to the profile after ordering.
- **Account** `app/account/` (layout guards via `requireUser`, tabs in layout):
  `/account` overview + recent orders + saved address, `/account/orders` history,
  `/account/orders/[id]` detail, `/account/profile` edits name/phone + saved address
  (email immutable). Order queries: `lib/orders.ts`.
- **Wishlist** `lib/wishlist/` + `/wishlist` page — session-cookie based (reuses the
  cart session cookie `artblush_cart`, works for guests too). Heart button on
  `ArtworkCard` + artwork detail; `component/WishlistButton.tsx` optimistic toggle +
  dispatches `wishlist-updated` event (header badge listens) + `router.refresh()` so
  `/wishlist` re-renders after a toggle. DB table `wishlist_items`.
- **Modern UX components**: `AccountMenu` (avatar initials in header; refetches
  `/api/me` on every navigation change so sign-in state updates after login/logout;
  logged-out header shows "Create account" + "Sign in" pills on desktop / "Sign in"
  on mobile; `variant="menu"` adds sign-in links inside the mobile menu;
  listens for `auth-updated`), `Toaster` (Listens `artblush-toast` CustomEvent from `lib/toast.ts`; shown on
  add-to-cart/wishlist/copied-link), `CheckoutSteps` (Bag → Details & Payment →
  Confirmation on cart/checkout/success), `OrderStatusTimeline` (order detail),
  `BackToTop` (root layout), `ShareLinks` (copy link / WhatsApp / native share on
  artwork detail), `Testimonials` (home page — **placeholder quotes, replace before
  launch**). Badge pop + toast keyframes live in `app/globals.css`.
- **Razorpay** `lib/razorpay/server.ts`: order creation + signature verification.
  `app/checkout/CheckoutForm.tsx` opens the checkout.js modal (created order via
  server action, `confirmPaidOrder` verifies the payment signature server-side).
  Webhook route at `app/api/razorpay/webhook`.
- **SOLD / inventory (Phase 2)**: when a payment is confirmed, every artwork in the
  order flips to `sold=true`, `saleable=false`, `status="Private Collection"`. Add-to-
  cart rejects sold pieces; `createCheckoutOrder` re-checks the cart against live DB
  rows and errors if a piece sold in between. Sold pieces stay in the portfolio gallery
  (works of art, one-of-one) but the detail page shows the "Interested?" band.
- **AUTH / ADMIN (Phase 3)**: `users.role` defaults `customer`. Who is an admin?
  Role in DB OR email listed in env `ADMIN_EMAILS` (comma-separated) — checked by
  `isAdminUser`. `requireAdmin()` in `lib/auth/session.ts` redirects guests to
  /login?next=/admin and non-admins to /account. `/api/me` returns `{user, isAdmin}`;
  the header avatar dropdown shows an "Admin" link for admins.
- **ADMIN dashboard (Phase 3)** `app/admin/` (its own ROOT layout):
  - Route groups: the storefront lives in `app/(site)/` (its layout renders the
    public Header/Footer and the full OG metadata); `app/admin/` has a SEPARATE
    root `<html>/<body>` layout with NO public chrome — the admin host and the
    storefront are visually and structurally independent. Admin pages use
    shadcn/ui components (`components/ui/*` — button, card, input, label, table,
    badge, separator, textarea, checkbox; `cn()` from `lib/utils.ts`). SITE
    TOKENS ARE UNTOUCHED: shadcn palette is scoped via `.admin-shell` CSS vars
    (globals.css), the ivory site is unaffected; admin root layout imports
    `../globals.css` itself.
  - Subdomain `admin.artblush.in` is OPS-ONLY (see `proxy.ts`): only `/admin*`,
    `/login` (rewrites to the dark `/admin/login`), static files allowed — any other
    path (cart, portfolio, artworks, about, signup, wishlist…) 307-redirects back
    to the dashboard. `www` still 307s any `/admin*` to the subdomain.
  - Themed separately with **shadcn/ui** (scoped to `.admin-shell` CSS vars in
    `app/globals.css` — the ivory storefront is untouched): dark zinc sidebar,
    white neutral work area. The admin sign-in (`/admin/login`, dark `.admin-auth`)
    is deliberately a different look from the storefront login.
  - `layout.tsx` renders the sidebar shell ONLY when `getCurrentUser` is an admin;
    browsers that aren't get the bare tree. Each admin page runs its own
    `requireAdmin()` guard (login page is deliberately unguarded). Server actions
    in `app/admin/actions.ts` re-guard with `requireAdmin`.
  - GOTCHA: `AdminNav` is a client component — pass lucide icons to it as a
    STRING key (client-side lookup table), never as a `ComponentType` function
    prop. React 19 throws "Functions cannot be passed directly to Client
    Components" and 500s the whole dashboard.
  - `/admin` dashboard: stats cards, latest orders, "Active admin sessions" widget
    (current signed-in admin sessions with per-row Revoke →
    `revokeAdminSessionAction`; sessions come from `lib/admin/sessions.ts`).
  - `/admin` stats (orders, revenue, awaiting-shipment, sold, new commissions).
  - `/admin/orders` + `/admin/orders/[id]`: payment status + shipping status /
    tracking number updates. Marking "shipped" emails the customer (Resend).
  - `/admin/artworks`: per-piece status/price(₹, stored as paise)/saleable. Status
    "Available" relists sold pieces (sold=false). This is the manual relist/revert
    tool for sold flags.
  - `/admin/commissions`: contact-form enquiries with status + internal note.
  - robots disallows /admin, /account, /cart, /checkout.
- **Commissions (Phase 3)**: `/contact` form POSTs via `app/contact/actions.ts`
  (`submitCommission`) into the `commissions` table + notifies the studio email
  (best-effort). Was previously a fake client-only form.
- **CACHE RULE**: `/`, `/portfolio`, `/artwork/[id]`, `/sitemap.xml` are
  statically prerendered at BUILD TIME. Any DB change to a piece's sold /
  saleable / status (admin `/admin/artworks` Save, or `confirmPaidOrder` after a
  payment) must call `revalidateStorefrontForArtworks(ids)` from
  `lib/revalidate-site.ts` (revalidates /, /portfolio, /sitemap.xml + each
  `/artwork/<id>`) or the storefront keeps showing stale buy buttons.
- **Emails (Phase 2/3, wired)**: `lib/email.ts` (Resend) sends the customer an
  order confirmation (summary + shipping + order ref) on paid order, a shipment
  notification when the admin marks an order shipped, a studio notification on
  paid orders and new commissions. Never blocks payments/actions on email
  (Promise.allSettled / best-effort). Requires env RESEND_API_KEY + RESEND_FROM_EMAIL
  (defaults to sandbox `onboarding@resend.dev`; verified sender/recipient needed
  in the Resend dashboard until a domain is added).
- **DB access** `db/index.ts` (`getDb` lazy singleton, `isDatabaseConfigured()`);
  `lib/data.ts` falls back to the static array in `lib/artworks.ts` when no DB.

## Pages/routes (Phase 2 additions)

- `/login`, `/signup` (searchParams `next` honored, action returns to it),
  `/account` (+ `/orders`, `/orders/[id]`, `/profile`) — all login-guarded.
- `/cart` (dynamic), `/checkout` (dynamic, login required), `/checkout/success`,
  `/wishlist` (dynamic — reads the cart session cookie), `/api/me` (GET, session-aware),
  `/api/razorpay/webhook` (POST), `/admin` + subpages (dynamic, requireAdmin).
  sitemap updated.
- NOTE: root layout does NOT read the session — only protected pages do, so public
  marketing routes stay prerenderable. If you add session reads to the root layout
  everything becomes dynamic.

## Commerce voice — "art first, price second"

- NO prices on cards/grids (`ArtworkCard` shows title/year/medium only) and no sale
  badges or "BUY NOW" shouts anywhere. Price appears once, quietly, inside the
  "Own the original" purchase band on the artwork detail page — AFTER description
  and story. Keep this order when editing: story → trust → purchase.
- Artwork detail pages carry `VisualArtwork` + `Product` JSON-LD, per-page
  Open Graph/twitter images (absolute URLs, metadataBase www.artblush.in), canonical
  URLs, studio notes (one-of-one / signed & framed / provenance), prev/next
  navigation, and related pieces. Default OG image for other pages is in
  `app/layout.tsx` (uses `/portfolio-photos/pensive.jpg`).

## Environment / toolchain on this machine

- Windows (PowerShell 5.1). Git 2.55 + GitHub CLI installed; note: git/gh may need
  PATH refresh in a fresh shell; gh.exe at `C:\Program Files\GitHub CLI\gh.exe`.
- Node v24, Next.js 16 (App Router + Turbopack), React 19, Tailwind v4.
- Design tokens in `app/globals.css` (ivory `#f4efe6`, ink `#1f1b15`, clay `#9b6b43`).
- Added deps: `drizzle-orm`, `drizzle-kit` (dev), `@neondatabase/serverless`,
  `razorpay`, `tsx` (dev).
- `.env.local` + Vercel env vars needed: DATABASE_URL, RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET, RAZORPAY_WEBHOOK_SECRET (optional), RESEND_API_KEY (optional —
  emails silently skip when unset), RESEND_FROM_EMAIL, ARTBLUSH_STUDIO_NOTIFY_EMAIL.
  See `.env.example`.

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

- [x] Phase 2 inventory: sold flag auto-set on paid order (checkout guards double-sell)
- [x] Phase 3 admin dashboard: orders / artworks / commissions management
- [x] Phase 3 shipping & tracking: statuses, tracking number, customer timeline, shipment email
- [x] Phase 3 commissions: contact form → DB (admin manages pipeline)
- [~] Phase 2 customer email: Resend code wired; needs RESEND_API_KEY in envs +
      verified sender/recipient on the Resend dashboard before mail actually sends
- [ ] Set ADMIN_EMAILS + promote owner role in DB; add REAL contact/studio email
- [ ] Swap placeholder artwork prices for real studio pricing before real-money launch
- [ ] Optionally register Razorpay webhook (https://www.artblush.in/api/razorpay/webhook, payment.captured) + set RAZORPAY_WEBHOOK_SECRET
- [ ] Replace LIVE Razorpay keys when going into production
- [ ] Replace contact email placeholder in /contact + Footer
- [ ] Replace placeholder Testimonials quotes with real collector words
- [ ] Add rest of the portfolio pieces once photographed (owner uploads to assets/portfolio-photos/)
- [ ] og:image per-page is done for artwork; consider a branded 1200×630 OG card
- [ ] Phase 3 gaps held over: shipping API (real courier), tracking webhooks, admin notifications UI
- [ ] Phase 4: commission builder, progress tracking, gift cards, reviews, limited editions, wall visualization, personalized recommendations
