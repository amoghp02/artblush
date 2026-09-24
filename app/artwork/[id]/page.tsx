import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ArtworkImage from "@/components/ArtworkImage";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import ButtonLink from "@/components/ButtonLink";
import ArtworkCard from "@/components/ArtworkCard";
import AddToCartButton from "@/components/AddToCartButton";
import WishlistButton from "@/components/WishlistButton";
import ShareLinks from "@/components/ShareLinks";
import {
  getArtwork,
  getRelatedArtworks,
  getArtworks,
} from "@/lib/data";

const SITE_URL = "https://www.artblush.in";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const artworks = await getArtworks();
  return artworks.map((art) => ({ id: art.id }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const artwork = await getArtwork(id);
  if (!artwork) return {};
  const url = `${SITE_URL}/artwork/${artwork.id}`;
  const image = artwork.image.startsWith("http")
    ? artwork.image
    : `${SITE_URL}${artwork.image}`;
  return {
    title: `${artwork.title} — Original Artwork by ArtBlush`,
    description: artwork.description,
    alternates: { canonical: `/artwork/${artwork.id}` },
    openGraph: {
      title: `${artwork.title} — ArtBlush`,
      description: artwork.description,
      type: "website",
      url,
      images: [{ url: image, alt: artwork.imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${artwork.title} — ArtBlush`,
      description: artwork.description,
      images: [image],
    },
  };
}

export default async function ArtworkPage({ params }: PageProps) {
  const { id } = await params;
  const artwork = await getArtwork(id);
  if (!artwork) notFound();

  const all = await getArtworks();
  const related = await getRelatedArtworks(id);

  const index = all.findIndex((art) => art.id === artwork.id);
  const prev = index > 0 ? all[index - 1] : null;
  const next = index >= 0 && index < all.length - 1 ? all[index + 1] : null;

  const details = [
    { label: "Medium", value: artwork.medium },
    { label: "Dimensions", value: artwork.dimensions },
    { label: "Year", value: String(artwork.year) },
    { label: "Status", value: artwork.status },
  ];

  const pageUrl = `${SITE_URL}/artwork/${artwork.id}`;
  const imageUrl = artwork.image.startsWith("http")
    ? artwork.image
    : `${SITE_URL}${artwork.image}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "VisualArtwork",
        name: artwork.title,
        artist: { "@type": "Person", name: "ArtBlush" },
        artForm: "Drawing",
        artMedium: artwork.medium,
        material: artwork.medium,
        dateCreated: artwork.year,
        image: imageUrl,
        description: artwork.description,
      },
      ...(artwork.saleable && artwork.price != null
        ? [
            {
              "@type": "Product",
              name: artwork.title,
              image: [imageUrl],
              description: artwork.description,
              brand: { "@type": "Brand", name: "ArtBlush" },
              offers: {
                "@type": "Offer",
                priceCurrency: artwork.currency ?? "INR",
                price: artwork.price / 100,
                availability:
                  artwork.status === "Available"
                    ? "https://schema.org/InStock"
                    : "https://schema.org/SoldOut",
                url: pageUrl,
                seller: { "@type": "Organization", name: "ArtBlush" },
              },
            },
          ]
        : []),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="mx-auto max-w-[1400px] px-5 pt-28 sm:px-8 md:px-10 md:pt-36">
        <p className="mb-8 text-[11px] font-medium uppercase tracking-[0.28em] text-foreground/45">
          <Link href="/portfolio" className="transition-colors hover:text-accent">
            Collection
          </Link>
          <span aria-hidden="true"> / </span>
          <span aria-current="page">{artwork.title}</span>
        </p>

        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <Reveal>
            <div className="relative overflow-hidden bg-[#e8e2d3] pb-[125%]">
              <ArtworkImage
                src={artwork.image}
                alt={artwork.imageAlt}
                priority
                sizes="(min-width: 1024px) 55vw, 100vw"
              />
              <div className="pointer-events-none absolute inset-0 border border-foreground/5" />
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="lg:sticky lg:top-28">
              <h1 className="font-display text-4xl leading-[1.08] font-light text-foreground sm:text-5xl">
                {artwork.title}
              </h1>
              <p className="mt-3 text-sm tracking-wide text-foreground/55">
                {artwork.medium} · {artwork.year}
              </p>

              <div className="mt-10 border-t border-foreground/10">
                <dl className="divide-y divide-foreground/10">
                  {details.map((d) => (
                    <div
                      key={d.label}
                      className="flex items-baseline justify-between gap-6 py-3.5"
                    >
                      <dt className="text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/45">
                        {d.label}
                      </dt>
                      <dd className="text-right text-sm text-foreground/80">{d.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="mt-8">
                <ShareLinks title={artwork.title} />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* About the work — the story comes before any mention of price */}
      <section className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 md:px-10 md:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <SectionHeading eyebrow="About the work" title={artwork.title} />
          </Reveal>
          <Reveal delay={80}>
            <p className="max-w-lg text-base leading-relaxed text-foreground/70">
              {artwork.description}
            </p>
            <h2 className="mt-10 text-[11px] font-medium uppercase tracking-[0.28em] text-foreground/45">
              The story
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-foreground/70">
              {artwork.story}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Acquire / Enquire — quiet commerce, after the story */}
      <section className="border-y border-foreground/10 bg-[#efe9dc]">
        <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 md:px-10 md:py-24">
          {artwork.saleable && artwork.price != null ? (
            <Reveal>
              <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
                <div className="flex-1 border border-foreground/10 bg-background p-8 sm:p-10">
                  <h2 className="font-display text-3xl font-light text-foreground sm:text-4xl">
                    Own the original
                  </h2>
                  <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-foreground/60">
                    Each piece is one-of-one, drawn by hand and signed at the studio.
                    It ships framed within 7–10 days with a certificate of
                    authenticity.
                  </p>
                  <div className="mt-8 flex justify-center">
                    <AddToCartButton
                      artworkId={artwork.id}
                      price={artwork.price}
                      currency={artwork.currency}
                      title={artwork.title}
                    />
                  </div>
                  <div className="mt-4 flex justify-center">
                    <WishlistButton artworkId={artwork.id} title={artwork.title} />
                  </div>
                  <Link
                    href="/contact"
                    className="mt-6 inline-block text-[13px] font-medium uppercase tracking-[0.18em] text-foreground/55 underline-offset-4 transition-colors hover:text-accent hover:underline"
                  >
                    Prefer to talk first? Enquire →
                  </Link>
                </div>
              </div>
            </Reveal>
          ) : (
            <Reveal>
              <h2 className="text-center font-display text-3xl font-light text-foreground sm:text-4xl">
                Interested in this artwork?
              </h2>
              <p className="mx-auto mt-4 max-w-md text-center text-sm leading-relaxed text-foreground/60">
                {artwork.status === "Available"
                  ? "Ask us anything about this piece — availability, shipping, or the story behind it."
                  : "This piece is already spoken for, but commissions are always open. Tell us about your idea."}
              </p>
              <div className="mt-8 flex justify-center">
                <ButtonLink href="/contact" variant="outline">
                  Enquire About Artwork →
                </ButtonLink>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* Studio notes */}
      <section className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 md:px-10 md:py-28">
        <div className="mx-auto grid max-w-2xl gap-10 border-t border-foreground/10 pt-12 text-center sm:grid-cols-3 sm:text-left">
          {[
            ["One of one", "Hand-drawn originals — never reproduced at scale."],
            ["Signed & framed", "Signed on the work; framed carefully by the studio."],
            ["With provenance", "A certificate of authenticity travels with the piece."],
          ].map(([heading, body]) => (
            <Reveal key={heading}>
              <h3 className="text-[11px] font-medium uppercase tracking-[0.22em] text-foreground">
                {heading}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/55">{body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Related */}
      <section className="mx-auto max-w-[1400px] px-5 pb-20 sm:px-8 md:px-10">
        <Reveal>
          <SectionHeading eyebrow="More" title="More from ArtBlush" />
        </Reveal>
        <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((art) => (
            <ArtworkCard key={art.id} artwork={art} />
          ))}
        </div>
      </section>

      {/* Prev / next */}
      {(prev || next) && (
        <section className="mx-auto max-w-[1400px] px-5 pb-24 sm:px-8 md:px-10">
          <div className="flex items-center justify-between gap-4 border-t border-foreground/10 pt-10">
            {prev ? (
              <Link
                href={`/artwork/${prev.id}`}
                className="group flex items-center gap-2 text-[13px] font-medium uppercase tracking-[0.18em] text-foreground/70 transition-colors hover:text-accent"
              >
                <ArrowLeft
                  size={16}
                  strokeWidth={1.6}
                  className="transition-transform duration-300 group-hover:-translate-x-1"
                />
                <span>
                  Previous — <span className="text-foreground">{prev.title}</span>
                </span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={`/artwork/${next.id}`}
                className="group flex items-center gap-2 text-[13px] font-medium uppercase tracking-[0.18em] text-foreground/70 transition-colors hover:text-accent"
              >
                <span>
                  <span className="text-foreground">{next.title}</span> — Next
                </span>
                <ArrowRight
                  size={16}
                  strokeWidth={1.6}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            ) : (
              <span />
            )}
          </div>
        </section>
      )}
    </>
  );
}