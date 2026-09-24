import "server-only";
import { revalidatePath } from "next/cache";

/**
 * The storefront home, portfolio, artwork detail pages (and sitemap) are
 * statically prerendered at build time, so DB changes in the admin / checkout
 * flows never show up unless they are revalidated. Call this after any change
 * that flips a piece's sold/saleable state to regenerate the cached pages.
 */
export function revalidateStorefrontForArtworks(artworkIds: string[]) {
  revalidatePath("/");
  revalidatePath("/portfolio");
  revalidatePath("/sitemap.xml");
  for (const id of artworkIds) {
    revalidatePath(`/artwork/${id}`);
  }
}