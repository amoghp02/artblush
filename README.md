# ArtBlush

A premium gallery-style portfolio website for **ArtBlush**, a hand-drawn portrait and
original artwork brand.

> **Phase 1** — frontend-only gallery (LIVE). **Phase 2** — shop/cart/checkout
> (Razorpay) built, pending database + payment credentials to go live.

## Tech

- **Next.js 16** (App Router, Turbopack)
- **React 19**
- **Tailwind CSS v4**
- **Drizzle ORM + Neon Postgres** (Phase 2)
- **Razorpay** payments SDK (Phase 2)
- **lucide-react** icons

## Getting started

```bash
npm install
npm run dev           # development — http://localhost:3000
npm run db:push       # push schema to Neon (needs DATABASE_URL)
npm run db:seed       # seed the 12 artworks (needs DATABASE_URL)
npm run build         # production build
npm run start         # serve the production build
npm run lint          # ESLint
```

Set the env vars in `.env.local` (see `.env.example`):
`DATABASE_URL`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, optional
`RAZORPAY_WEBHOOK_SECRET`.

## Pages

| Route                | Purpose                          |
| -------------------- | -------------------------------- |
| `/`                  | Home — hero, selected works, story, process, CTA |
| `/portfolio`         | Gallery with frontend category filters |
| `/artwork/:id`       | Editorial artwork detail page + buy/Enquire |
| `/cart`              | Shopping cart (cookie session)   |
| `/checkout`          | Address + Razorpay payment       |
| `/checkout/success`  | Post-payment confirmation        |
| `/about`             | Artist story, philosophy, process |
| `/contact`           | Enquiry form (no backend yet)    |

## Structure

```
app/
  layout.tsx            Root layout — fonts, metadata, Header/Footer
  page.tsx              Home page
  portfolio/            Portfolio page + filter client component
  artwork/[id]/         Artwork detail pages (SSG, DB-backed)
  cart/                 Cart page + line controls (client)
  checkout/             Checkout page + Razorpay form (client)
  checkout/success/     Paid confirmation
  api/razorpay/webhook/ Webhook handler (payment.captured)
  about/                About page
  contact/              Contact page + form client component
  sitemap.ts robots.ts  SEO helpers
components/
  Header / Footer / Reveal / ArtworkCard / ArtworkGrid /
  SectionHeading / CTASection / ProcessSection / ButtonLink / ArtworkImage /
  CartNavLink / AddToCartButton
db/
  schema.ts             artworks, cart_items, orders, order_items
  index.ts              Lazy Neon client (getDb)
  seed.ts               Seeds the 12 artworks (placeholder prices)
lib/
  artworks.ts           Static artwork source of truth (fallback)
  data.ts               Data seam — DB when DATABASE_URL set, else static
  cart/                 Cookie session + server actions
  razorpay/             Order creation + signature verification (server-only)
```

## Artwork data

All artworks live in `lib/artworks.ts` as a typed `Artwork` array. Add a new artwork
by appending one object:

```ts
{
  id: "unique-slug",
  title: "Portrait in Silence",
  categories: ["portraits", "graphite"],
  medium: "Graphite on paper",
  year: 2026,
  dimensions: "30 × 40 cm",
  image: "photo-xxxxxxxxxxx",            // Unsplash photo slug (temporary)
  imageAlt: "Accessible description",
  description: "Short blurb shown on cards and detail page",
  story: "Longer story shown on the detail page",
  status: "Available",
  price: 350000,                          // PAISE; only if saleable
  currency: "INR",
  saleable: true,
  featured: true,
}
```

Prices are stored in **paise** (Razorpay convention); the UI divides by 100.
`generateStaticParams` in `app/artwork/[id]/page.tsx` prerenders every artwork page
at build time — no extra wiring needed for new entries. Page data is served from
Postgres when `DATABASE_URL` is configured, falling back to the static array so
builds and read-only browsing work without a database. Run `db:push` + `db:seed`
once to populate the 12 artworks.

## Placeholder images

Artwork photos are temporary **Unsplash** images rendered through a monochrome
grayscale treatment (`components/ArtworkImage.tsx`) so they read as graphite/charcoal
studies. Replace the `image` values in `lib/artworks.ts` with real ArtBlush artwork
when ready — swap the files into `public/` or a CDN and update the URL.

Contact details, social links, and the `metadataBase` / sitemap host in
`app/layout.tsx` and `app/sitemap.ts` are placeholders — replace them before launch.
Contact email `hello@artblush.example.com` is a placeholder.

## Deployment

Production: **https://www.artblush.in** (apex `artblush.in` redirects here) —
auto-deploys on every push to `main` via Vercel's GitHub integration.
Backup URL: https://artblush.vercel.app

```bash
vercel --prod   # manual deploy from this machine (if not using git)
```

Required Vercel environment variables: `DATABASE_URL`, `RAZORPAY_KEY_ID`,
`RAZORPAY_KEY_SECRET`, optional `RAZORPAY_WEBHOOK_SECRET`. Configure the Razorpay
webhook to `https://www.artblush.in/api/razorpay/webhook` (payment.captured).

## Future phases (intentionally not built)

- Phase 2b: Customer accounts, order history, shipping
- Phase 3: Admin dashboard, orders, inventory, commission management
- Phase 4: Commission builder, progress tracking, certificates, wishlist, reviews