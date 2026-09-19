"use server";

import { revalidatePath } from "next/cache";
import {
  addToCart,
  getCartLines,
  removeFromCart,
  updateCartQuantity,
} from "@/lib/cart/server";

export async function addToCartAction(artworkId: string) {
  const result = await addToCart(artworkId, 1);
  if (result.ok) revalidatePath("/cart");
  return result;
}

export async function updateCartQuantityAction(artworkId: string, quantity: number) {
  const result = await updateCartQuantity(artworkId, quantity);
  if (result.ok) revalidatePath("/cart");
  return result;
}

export async function removeFromCartAction(artworkId: string) {
  const result = await removeFromCart(artworkId);
  if (result.ok) revalidatePath("/cart");
  return result;
}

export async function getCartCountAction(): Promise<number> {
  const lines = await getCartLines();
  return lines.reduce((sum, line) => sum + line.quantity, 0);
}