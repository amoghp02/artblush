import type { MetadataRoute } from "next";
import { artworks } from "@/lib/artworks";

const baseUrl = "https://www.artblush.in";

const staticRoutes = ["", "/portfolio", "/about", "/contact"].map((route) => ({
  url: `${baseUrl}${route}`,
  lastModified: new Date(),
  changeFrequency: "weekly" as const,
  priority: 0.8,
}));

const artworkRoutes = artworks.map((art) => ({
  url: `${baseUrl}/artwork/${art.id}`,
  lastModified: new Date(),
  changeFrequency: "monthly" as const,
  priority: 0.7,
}));

export default function sitemap(): MetadataRoute.Sitemap {
  return [...staticRoutes, ...artworkRoutes];
}