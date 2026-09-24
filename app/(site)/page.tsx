import Link from "next/link";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import ButtonLink from "@/components/ButtonLink";
import ArtworkCard from "@/components/ArtworkCard";
import ProcessSection from "@/components/ProcessSection";
import CTASection from "@/components/CTASection";
import Testimonials from "@/components/Testimonials";
import ArtworkImage from "@/components/ArtworkImage";
import { getFeaturedArtworks, getArtworks } from "@/lib/data";

const processSteps = [
  {
    number: "01",
    title: "Reference",
    text: "You share a photograph and the story behind it — the moment you want preserved.",
  },
  {
    number: "02",
    title: "Sketch",
    text: "A loose graphite sketch captures gesture, likeness and composition.",
  },
  {
    number: "03",
    title: "Detail",
    text: "Layer by layer, lines become values, and values become depth.",
  },
  {
    number: "04",
    title: "Finished Artwork",
    text: "A hand-finished piece, signed, and ready to live in your home.",
  },
];

export default async function HomePage() {
  const featured = await getFeaturedArtworks(6);
  const artworks = await getArtworks();
  const hero = artworks[0];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-[1400px] px-5 pt-28 sm:px-8 sm:pt-32 md:px-10 md:pt-36">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
            <Reveal>
              <p className="mb-6 text-[11px] font-medium uppercase tracking-[0.28em] text-foreground/45">
                Hand-drawn portraits & originals
              </p>
              <h1 className="font-display text-5xl leading-[1.05] font-light text-foreground sm:text-6xl md:text-7xl">
                Art, drawn
                <br />
                with feeling.
              </h1>
              <p className="mt-6 max-w-md text-base leading-relaxed text-foreground/60">
                Hand-drawn portraits and original artworks created to turn meaningful
                moments into timeless pieces.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:gap-6">
                <ButtonLink href="/portfolio">Explore the Collection</ButtonLink>
                <ButtonLink href="/contact" variant="outline">
                  Commission a Portrait
                </ButtonLink>
              </div>
            </Reveal>

            <Reveal delay={150}>
              <div className="relative">
                <div className="relative overflow-hidden pb-[118%] bg-[#e8e2d3]">
                  <ArtworkImage
                    src={hero.image}
                    alt={hero.imageAlt}
                    priority
                    sizes="(min-width: 1024px) 45vw, 100vw"
                  />
                </div>
                <div className="pointer-events-none absolute inset-0 border border-foreground/5" />
                <div className="mt-5 flex items-baseline justify-between">
                  <p className="font-display text-lg text-foreground">{hero.title}</p>
                  <p className="text-xs tracking-wide text-foreground/50">
                    {hero.medium} · {hero.year}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Featured Artwork */}
      <section className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 md:px-10 md:py-32">
        <Reveal>
          <SectionHeading
            eyebrow="Featured"
            title="Selected Works"
            description="A collection of portraits, studies and original works created by hand."
          />
        </Reveal>

        {/* Editorial asymmetric grid */}
        <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          <ArtworkCard artwork={featured[0]} priority />
          <div className="lg:pt-16">
            <ArtworkCard artwork={featured[1]} />
          </div>
          <div className="lg:pt-8">
            <ArtworkCard artwork={featured[2]} />
          </div>
          <ArtworkCard artwork={featured[3]} />
          <div className="lg:pt-16">
            <ArtworkCard artwork={featured[4]} />
          </div>
          <div className="lg:pt-8">
            <ArtworkCard artwork={featured[5]} />
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="border-t border-foreground/10 bg-[#efe9dc]">
        <div className="mx-auto grid max-w-[1400px] items-center gap-12 px-5 py-24 sm:px-8 md:px-10 md:py-32 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <SectionHeading
              eyebrow="The story"
              title="Every line tells a story."
              description="ArtBlush is built around the belief that the most meaningful artwork is personal. Every sketch begins with a memory, a person or a moment worth preserving."
            />
            <Link
              href="/about"
              className="group mt-8 inline-flex items-center gap-2 text-[13px] font-medium uppercase tracking-[0.18em] text-foreground transition-colors hover:text-accent"
            >
              Discover the Artist
              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </Reveal>

          <Reveal delay={120}>
            <div className="relative">
              <div className="relative overflow-hidden pb-[72%] bg-[#e8e2d3]">
                <ArtworkImage
                  src="/portfolio-photos/pensive.jpg"
                  alt="A charcoal portrait study resting on the studio table, mid-thought"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
              </div>
              <p className="mt-4 text-xs tracking-wide text-foreground/50">
                The studio — where reference becomes sketch, and sketch becomes memory.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* Custom artwork */}
      <section className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 md:px-10 md:py-32">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-4xl leading-[1.1] font-light text-foreground sm:text-5xl">
              Made for you.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-foreground/60">
              Have someone special in mind? Commission a hand-drawn portrait created
              from your photograph.
            </p>
            <div className="mt-10">
              <ButtonLink href="/contact" variant="outline">
                Commission a Portrait →
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Process */}
      <section className="mx-auto max-w-[1400px] px-5 pb-24 sm:px-8 md:px-10 md:pb-32">
        <Reveal>
          <SectionHeading
            eyebrow="Process"
            title="From reference to finished artwork"
            className="mb-14"
          />
        </Reveal>
        <ProcessSection steps={processSteps} />
      </section>

      {/* Final CTA */}
      <CTASection
        eyebrow="Commission"
        title="Some moments deserve to be drawn."
        text="Explore the collection or create something personal."
        primary={{ label: "View Portfolio", href: "/portfolio" }}
        secondary={{ label: "Commission Artwork", href: "/contact" }}
      />
    </>
  );
}