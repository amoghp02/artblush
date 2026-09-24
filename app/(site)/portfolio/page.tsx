import type { Metadata } from "next";
import PortfolioGallery from "./PortfolioGallery";
import { getArtworks } from "@/lib/data";

export const metadata: Metadata = {
  title: "Portfolio — ArtBlush",
  description:
    "Explore the ArtBlush collection — a growing archive of hand-drawn portraits and original works in graphite and charcoal.",
};

export default async function PortfolioPage() {
  const artworks = await getArtworks();
  return <PortfolioGallery artworks={artworks} />;
}