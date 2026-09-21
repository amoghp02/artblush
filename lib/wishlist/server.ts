import "server-only";

import { and, eq } from "drizzle-orm";
import { getDb, isDatabaseConfigured } from "@/db";
import { artworks, wishlistItems } from "@/db/schema";
import { getOrCreateSessionId, getSessionId } from "@/lib/cart/server";
import type { Artwork } from "@/lib/artworks";

export async function getWishlistIds(): Promise<string[]> {
  const sessionId = await getSessionId();
  if (!isDatabaseConfigured() || !sessionId) return [];

  const rows = await getDb()
    .select({ artworkId: wishlistItems.artworkId })
    .from(wishlistItems)
    .where(eq(wishlistItems.sessionId, sessionId));

  return rows.map((row) => row.artworkId);
}

export function toArtwork(
  row: typeof artworks.$inferSelect,
): Artwork {
  return {
    id: row.id,
    title: row.title,
    categories: row.categories as Artwork["categories"],
    medium: row.medium,
    year: row.year,
    dimensions: row.dimensions,
    image: row.image,
    imageAlt: row.imageAlt,
    description: row.description,
    story: row.story,
    status: row.status as Artwork["status"],
    featured: row.featured ?? undefined,
    price: row.price ?? undefined,
    currency: row.currency ?? undefined,
    saleable: row.saleable ?? undefined,
  };
}

export async function getWishlistArtworks(): Promise<
  { artwork: Artwork; addedAt: Date }[]
> {
  const sessionId = await getSessionId();
  if (!isDatabaseConfigured() || !sessionId) return [];

  const rows = await getDb()
    .select()
    .from(wishlistItems)
    .innerJoin(artworks, eq(wishlistItems.artworkId, artworks.id))
    .where(eq(wishlistItems.sessionId, sessionId));

  return rows.map((row) => ({
    artwork: toArtwork(row.artworks),
    addedAt: row.wishlist_items.createdAt,
  }));
}

export async function toggleWishlist(
  artworkId: string,
  currentlyWishlisted: boolean,
): Promise<{ ok: boolean; wishlisted: boolean }> {
  if (!isDatabaseConfigured()) return { ok: false, wishlisted: currentlyWishlisted };

  const sessionId = await getOrCreateSessionId();
  const db = getDb();

  if (currentlyWishlisted) {
    await db
      .delete(wishlistItems)
      .where(
        and(
          eq(wishlistItems.sessionId, sessionId),
          eq(wishlistItems.artworkId, artworkId),
        ),
      );
    return { ok: true, wishlisted: false };
  }

  await db
    .insert(wishlistItems)
    .values({ sessionId, artworkId })
    .onConflictDoNothing();
  return { ok: true, wishlisted: true };
}