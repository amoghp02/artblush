# ArtBlush

A premium gallery-style portfolio website for **ArtBlush**, a hand-drawn portrait and
original artwork brand.

> **Phase 1** — frontend only. No marketplace, payments, database, authentication, or
> admin features are included yet by design.

## Tech

- **Next.js 16** (App Router, Turbopack)
- **React 19**
- **Tailwind CSS v4**
- **lucide-react** icons

## Getting started

```bash
npm install
npm run dev      # development — http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
npm run lint     # ESLint
```

## Pages

| Route                | Purpose                          |
| -------------------- | -------------------------------- |
| `/`                  | Home — hero, selected works, story, process, CTA |
| `/portfolio`         | Gallery with frontend category filters |
| `/artwork/:id`       | Editorial artwork detail page    |
| `/about`             | Artist story, philosophy, process |
| `/contact`           | Enquiry form (no backend yet)    |

## Structure

```
app/
  layout.tsx            Root layout — fonts, metadata, Header/Footer
  page.tsx              Home page
  portfolio/            Portfolio page + filter client component
  artwork/[id]/         Static artwork detail pages
  about/                About page
  contact/              Contact page + form client component
  sitemap.ts robots.ts  SEO helpers
components/
  Header / Footer / Reveal / ArtworkCard / ArtworkGrid /
  SectionHeading / CTASection / ProcessSection / ButtonLink / ArtworkImage
lib/
  artworks.ts           All artwork data in one typed file
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
  featured: true,
}
```

`generateStaticParams` in `app/artwork/[id]/page.tsx` prerenders every artwork page
at build time — no extra wiring needed for new entries.

## Placeholder images

Artwork photos are temporary **Unsplash** images rendered through a monochrome
grayscale treatment (`components/ArtworkImage.tsx`) so they read as graphite/charcoal
studies. Replace the `image` values in `lib/artworks.ts` with real ArtBlush artwork
when ready — swap the files into `public/` or a CDN and update the URL.

Contact details, social links, and the `metadataBase` / sitemap host in
`app/layout.tsx` and `app/sitemap.ts` are placeholders — replace them before launch.

## Future phases (intentionally not built)

- Phase 2: Shop, cart, checkout (Razorpay), customer accounts
- Phase 3: Admin dashboard, orders, inventory, commission management, shipping
- Phase 4: Commission builder, progress tracking, certificates, wishlist, reviews