import "server-only";

import { cookies } from "next/headers";
import { and, eq } from "drizzle-orm";
import { getDb, isDatabaseConfigured } from "@/db";
import { artworks, cartItems } from "@/db/schema";
import type { Artwork } from "@/lib/artworks";

export const CART_COOKIE = "artblush_cart";

export interface CartLine {
  artwork: Artwork;
  quantity: number;
}

async function getOrCreateSessionId(): Promise<string> {
  const store = await cookies();
  const existing = store.get(CART_COOKIE)?.value;
  if (existing) return existing;
  const id = crypto.randomUUID();
  store.set(CART_COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return id;
}

async function getSessionId(): Promise<string | null> {
  const store = await cookies();
  return store.get(CART_COOKIE)?.value ?? null;
}

export async function getCartLines(): Promise<CartLine[]> {
  const sessionId = await getSessionId();
  if (!isDatabaseConfigured() || !sessionId) return [];

  const rows = await getDb()
    .select({
      artwork: artworks,
      quantity: cartItems.quantity,
    })
    .from(cartItems)
    .innerJoin(artworks, eq(cartItems.artworkId, artworks.id))
    .where(eq(cartItems.sessionId, sessionId));

  return rows.map((row) => ({
    artwork: {
      id: row.artwork.id,
      title: row.artwork.title,
      categories: row.artwork.categories as Artwork["categories"],
      medium: row.artwork.medium,
      year: row.artwork.year,
      dimensions: row.artwork.dimensions,
      image: row.artwork.image,
      imageAlt: row.artwork.imageAlt,
      description: row.artwork.description,
      story: row.artwork.story,
      status: row.artwork.status,
      featured: row.artwork.featured,
      price: row.artwork.price ?? undefined,
      currency: row.artwork.currency,
      saleable: row.artwork.saleable,
    },
    quantity: row.quantity,
  }));
}

export async function addToCart(artworkId: string, quantity = 1) {
  if (!isDatabaseConfigured()) return { ok: false };
  const sessionId = await getOrCreateSessionId();
  const db = getDb();

  const [artwork] = await db
    .select()
    .from(artworks)
    .where(eq(artworks.id, artworkId))
    .limit(1);

  if (!artwork || !artwork.saleable || artwork.price == null) {
    return { ok: false };
  }

  await db
    .insert(cartItems)
    .values({ sessionId, artworkId, quantity })
    .onConflictDoUpdate({
      target: [cartItems.sessionId, cartItems.artworkId],
      set: { quantity: quantity },
    });

  return { ok: true };
}

export async function updateCartQuantity(artworkId: string, quantity: number) {
  const sessionId = await getSessionId();
  if (!isDatabaseConfigured() || !sessionId || quantity < 1) return { ok: false };

  await getDb()
    .update(cartItems)
    .set({ quantity })
    .where(
      and(eq(cartItems.sessionId, sessionId), eq(cartItems.artworkId, artworkId)),
    );

  return { ok: true };
}

export async function removeFromCart(artworkId: string) {
  const sessionId = await getSessionId();
  if (!isDatabaseConfigured() || !sessionId) return { ok: false };

  await getDb()
    .delete(cartItems)
    .where(
      and(eq(cartItems.sessionId, sessionId), eq(cartItems.artworkId, artworkId)),
    );

  return { ok: true };
}

export async function clearCart() {
  const sessionId = await getSessionId();
  if (!isDatabaseConfigured() || !sessionId) return;
  await getDb().delete(cartItems).where(eq(cartItems.sessionId, sessionId));
}

export function cartTotal(lines: CartLine[]): number {
  return lines.reduce((sum, line) => {
    return sum + (line.artwork.price ?? 0) * line.quantity;
  }, 0);
}