<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# ArtBlush — Project Memory (auto-loaded by AI coding agents)

Hand-drawn portrait / charcoal art brand. 'Art, Drawn With Feeling'. Read this
before making any changes; update it as the project evolves.

## Status: Phase 1 COMPLETE — LIVE

Frontend-only premium gallery site. No backend/payments/auth/admin by design yet.

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

## Domain / DNS (GoDaddy)

- `A     @    76.76.21.21`            (Vercel apex)
- `CNAME www  cname.vercel-dns.com`  (Vercel)
- SSL auto-provisioned by Vercel (Let's Encrypt). apex → www redirect is correct.

## Environment / toolchain on this machine

- Windows (PowerShell 5.1). Git 2.55 + GitHub CLI installed; note: git/gh may need
  PATH refresh in a fresh shell; gh.exe at `C:\Program Files\GitHub CLI\gh.exe`.
- Node v24, Next.js 16 (App Router + Turbopack), React 19, Tailwind v4.
- Design tokens in `app/globals.css` (ivory `#f4efe6`, ink `#1f1b15`, clay `#9b6b43`).

## Architecture

- 12 artworks in `lib/artworks.ts` (typed array; each entry
  auto-prerenders an artwork page via `generateStaticParams`).
- Images: temporary Unsplash URLs, monochrome grayscale treatment in
  `components/ArtworkImage.tsx`; swap `image` fields for real art later.
- Pages: `/`, `/portfolio` (+ frontend filters), `/artwork/[id]`, `/about`,
  `/contact` (client form, success state only — no backend), 404, sitemap, robots.
- `metadataBase` + sitemap host: `https://www.artblush.in` (done).
- Contact email `hello@artblush.example.com` is still a PLACEHOLDER (needs real
  studio email before launch).

## Verification commands

```bash
npm run lint      # ESLint
npm run build     # production build
git push          # auto-deploys to Vercel
```

## Placeholder / TODO (phase-gating)

- [ ] Replace contact email placeholder
- [ ] Replace Unsplash artwork images with real ArtBlush art
- [ ] og:image for social previews (needs a real artwork asset)
- [ ] Phase 2: shop, cart, checkout (Razorpay), customer accounts
- [ ] Phase 3: admin dashboard, orders, inventory, commissions
- [ ] Phase 4: commission builder, progress tracking, certificates, wishlist
