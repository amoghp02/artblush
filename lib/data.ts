import { asc, eq } from "drizzle-orm";
import { artworks, type ArtworkRow } from "@/db/schema";
import { getDb, isDatabaseConfigured } from "@/db";
import {
  artworks as staticArtworks,
  getArtwork as getStaticArtwork,
  type Artwork,
  type Category,
} from "./artworks";

export { categories } from "./artworks";
export type { Artwork, Category, Status } from "./artworks";

function toArtwork(row: ArtworkRow): Artwork {
  return {
    id: row.id,
    title: row.title,
    categories: row.categories as Category[],
    medium: row.medium,
    year: row.year,
    dimensions: row.dimensions,
    image: row.image,
    imageAlt: row.imageAlt,
    description: row.description,
    story: row.story,
    status: row.status,
    featured: row.featured,
    price: row.price ?? undefined,
    currency: row.currency,
    saleable: row.saleable,
    sold: row.sold,
  };
}

export async function getArtworks(): Promise<Artwork[]> {
  if (!isDatabaseConfigured()) return staticArtworks;
  const rows = await getDb().select().from(artworks).orderBy(asc(artworks.createdAt));
  return rows.map(toArtwork);
}

export async function getArtwork(id: string): Promise<Artwork | undefined> {
  if (!isDatabaseConfigured()) return getStaticArtwork(id);
  const rows = await getDb()
    .select()
    .from(artworks)
    .where(eq(artworks.id, id))
    .limit(1);
  return rows[0] ? toArtwork(rows[0]) : undefined;
}

export async function getFeaturedArtworks(count = 6): Promise<Artwork[]> {
  const all = await getArtworks();
  const featured = all.filter((art) => art.featured);
  const rest = all.filter((art) => !art.featured);
  return [...featured, ...rest].slice(0, count);
}

export async function getRelatedArtworks(id: string, count = 3): Promise<Artwork[]> {
  const [all, active] = await Promise.all([getArtworks(), getArtwork(id)]);
  if (!active) return [];
  const related = all
    .filter((art) => art.id !== id)
    .sort((a, b) => {
      const score = (art: Artwork) =>
        art.categories.filter((c) => active.categories.includes(c)).length;
      return score(b) - score(a);
    });
  return related.slice(0, count);
}

/** Artworks available for purchase (saleable, priced, and not yet sold). */
export async function getSaleableArtworks(): Promise<Artwork[]> {
  const all = await getArtworks();
  return all.filter(
    (art) => art.saleable && art.price != null && !art.sold,
  );
}