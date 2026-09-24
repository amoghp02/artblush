import type { Metadata } from "next";
import { Heart } from "lucide-react";
import ArtworkCard from "@/components/ArtworkCard";
import WishlistButton from "@/components/WishlistButton";
import SectionHeading from "@/components/SectionHeading";
import ButtonLink from "@/components/ButtonLink";
import { getWishlistArtworks } from "@/lib/wishlist/server";

export const metadata: Metadata = {
  title: "Your Wishlist — ArtBlush",
  description: "Artworks you have saved at ArtBlush.",
};

export default async function WishlistPage() {
  const items = await getWishlistArtworks();

  return (
    <section className="mx-auto max-w-[1400px] px-5 pb-24 pt-32 sm:px-8 md:px-10 md:pt-40">
      <SectionHeading
        eyebrow="Saved pieces"
        title={
          items.length > 0
            ? `Your wishlist (${items.length})`
            : "Nothing here yet"
        }
      />

      {items.length === 0 ? (
        <div className="mt-14 flex flex-col items-center gap-6 text-center">
          <Heart className="text-foreground/25" size={40} strokeWidth={1.2} />
          <p className="max-w-md text-sm leading-relaxed text-foreground/60">
            Tap the heart on any artwork to save it here — perfect for pieces you are
            deciding on, or gift ideas for someone special.
          </p>
          <ButtonLink href="/portfolio">Browse the collection →</ButtonLink>
        </div>
      ) : (
        <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ artwork }) => (
            <div key={artwork.id} className="relative">
              <ArtworkCard artwork={artwork} />
              <WishlistButton
                artworkId={artwork.id}
                title={artwork.title}
                variant="card"
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}