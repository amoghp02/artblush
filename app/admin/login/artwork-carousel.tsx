"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const SLIDES = [
  { src: "/portfolio-photos/pensive.jpg" },
  { src: "/portfolio-photos/those-eyes-those-curls.png" },
  { src: "/portfolio-photos/the-rider.png" },
  { src: "/portfolio-photos/laugh-lines.png" },
  { src: "/portfolio-photos/first-smile.png" },
  { src: "/portfolio-photos/pure-delight.png" },
  { src: "/portfolio-photos/beneath-the-skin.png" },
  { src: "/portfolio-photos/with-a-bow.png" },
];

const INTERVAL_MS = 5000;

export function ArtworkCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(
      () => setActive((i) => (i + 1) % SLIDES.length),
      INTERVAL_MS,
    );
    return () => clearInterval(id);
  }, [paused]);

  return (
    <div
      className="absolute inset-0"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {SLIDES.map((slide, i) => (
        <Image
          key={slide.src}
          src={slide.src}
          alt=""
          fill
          priority={i === 0}
          sizes="(min-width: 768px) 40vw, 100vw"
          className={`object-cover transition-opacity duration-1000 ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      <div
        className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/15"
        aria-hidden
      />

      <div
        className="absolute right-4 top-4 flex items-center gap-1.5"
        role="tablist"
        aria-label="Artwork slides"
      >
        {SLIDES.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === active}
            aria-label={`Show slide ${i + 1}`}
            onClick={() => setActive(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === active
                ? "w-6 bg-zinc-100"
                : "w-1.5 bg-zinc-500/60 hover:bg-zinc-300/80"
            }`}
          />
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-zinc-400">
          Original artwork
        </p>
        <p className="mt-2 font-display text-2xl font-light leading-snug text-zinc-50">
          Art, drawn with feeling.
        </p>
        <p className="mt-2 text-xs leading-relaxed text-zinc-400">
          Hand-drawn portraits, graphite and charcoal — signed at the studio.
        </p>
      </div>
    </div>
  );
}