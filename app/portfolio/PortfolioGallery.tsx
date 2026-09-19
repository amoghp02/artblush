"use client";

import { useMemo, useState } from "react";
import Reveal from "@/components/Reveal";
import ArtworkGrid from "@/components/ArtworkGrid";
import { categories, type Category, type Artwork } from "@/lib/artworks";

interface PortfolioGalleryProps {
  artworks: Artwork[];
}

export default function PortfolioGallery({ artworks }: PortfolioGalleryProps) {
  const [active, setActive] = useState<Category | "all">("all");

  const filtered = useMemo(() => {
    if (active === "all") return artworks;
    return artworks.filter((art) => art.categories.includes(active));
  }, [active, artworks]);

  return (
    <>
      <div className="mx-auto max-w-[1400px] px-5 pt-32 sm:px-8 md:px-10 md:pt-40">
        <Reveal>
          <h1 className="font-display text-4xl leading-[1.1] font-light text-foreground sm:text-5xl md:text-6xl">
            The ArtBlush Collection
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-foreground/60">
            A growing archive of hand-drawn portraits and original works.
          </p>
        </Reveal>

        <nav
          aria-label="Filter artworks"
          className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-y border-foreground/10 py-5"
        >
          {categories.map((cat) => {
            const isActive = active === cat.value;
            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => setActive(cat.value)}
                aria-pressed={isActive}
                className={`text-[13px] font-medium uppercase tracking-[0.18em] transition-colors duration-300 ${
                  isActive ? "text-accent" : "text-foreground/55 hover:text-foreground"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </nav>
      </div>

      <section className="mx-auto max-w-[1400px] px-5 py-14 sm:px-8 md:px-10 md:py-16">
        <ArtworkGrid artworks={filtered} />
      </section>
    </>
  );
}