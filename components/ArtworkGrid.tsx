import type { Artwork } from "@/lib/artworks";
import ArtworkCard from "./ArtworkCard";

interface ArtworkGridProps {
  artworks: Artwork[];
  priority?: boolean;
}

export default function ArtworkGrid({ artworks, priority = false }: ArtworkGridProps) {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
      {artworks.map((artwork, i) => (
        <ArtworkCard key={artwork.id} artwork={artwork} priority={priority && i < 2} />
      ))}
    </div>
  );
}