import type { MetadataRoute } from "next";
import { getArtworks } from "@/lib/data";

const baseUrl = "https://www.artblush.in";

const staticRoutes = ["", "/portfolio", "/about", "/contact", "/cart", "/checkout"].map(
  (route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }),
);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const artworks = await getArtworks();
  const artworkRoutes = artworks.map((art) => ({
    url: `${baseUrl}/artwork/${art.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));
  return [...staticRoutes, ...artworkRoutes];
}