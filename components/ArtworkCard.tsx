import Link from "next/link";
import type { Artwork } from "@/lib/artworks";
import ArtworkImage from "./ArtworkImage";

interface ArtworkCardProps {
  artwork: Artwork;
  priority?: boolean;
}

export default function ArtworkCard({ artwork, priority = false }: ArtworkCardProps) {
  return (
    <Link
      href={`/artwork/${artwork.id}`}
      className="group block"
      aria-label={`${artwork.title} — ${artwork.medium}`}
    >
      <div className="relative overflow-hidden bg-[#e8e2d3] pb-[125%]">
        <ArtworkImage
          src={artwork.image}
          alt={artwork.imageAlt}
          priority={priority}
          className="group-hover:scale-[1.03] transition-transform duration-700 ease-out"
        />
        <div className="pointer-events-none absolute inset-0 border border-foreground/5 transition-colors duration-500 group-hover:border-accent/40" />
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-4">
        <h3 className="font-display text-lg leading-snug text-foreground">
          {artwork.title}
        </h3>
        <p className="shrink-0 text-xs tracking-wide text-foreground/55">
          <span className="sr-only">{artwork.medium} · </span>
          {artwork.year}
        </p>
      </div>
      <p className="mt-0.5 text-xs text-foreground/55">
        {artwork.medium}
        {artwork.saleable && artwork.price != null && (
          <span className="ml-3 text-foreground/80">
            ·
            {" "}
            {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
              maximumFractionDigits: 0,
            }).format(artwork.price / 100)}
          </span>
        )}
      </p>
    </Link>
  );
}