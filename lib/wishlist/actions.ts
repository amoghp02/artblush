"use server";

import { revalidatePath } from "next/cache";
import { getWishlistIds, toggleWishlist } from "./server";

export async function toggleWishlistAction(artworkId: string, wishlisted: boolean) {
  const result = await toggleWishlist(artworkId, wishlisted);
  if (result.ok) revalidatePath("/wishlist");
  return result;
}

export async function getWishlistIdsAction(): Promise<string[]> {
  return getWishlistIds();
}