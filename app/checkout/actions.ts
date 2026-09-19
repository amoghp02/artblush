"use server";

import { eq } from "drizzle-orm";
import { getDb, isDatabaseConfigured } from "@/db";
import { orderItems, orders } from "@/db/schema";
import { clearCart, getCartLines, cartTotal } from "@/lib/cart/server";
import { createRazorpayOrder } from "@/lib/razorpay/server";

export interface CheckoutInput {
  name: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
}

export interface CheckoutResult {
  keyId: string;
  razorpayOrderId: string;
  amountPaise: number;
  currency: string;
  dbOrderId: string;
}

/** Creates a Razorpay order + database order from the current cart. */
export async function createCheckoutOrder(input: CheckoutInput): Promise<CheckoutResult> {
  if (!isDatabaseConfigured()) {
    throw new Error("Payments are not configured yet.");
  }
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Payments are not configured yet.");
  }

  const lines = await getCartLines();
  if (lines.length === 0) {
    throw new Error("Your cart is empty.");
  }

  const totalPaise = cartTotal(lines);
  const receipt = `artblush-${Date.now()}`;

  const order = await createRazorpayOrder({
    amountPaise: totalPaise,
    currency: "INR",
    receipt,
    notes: { email: input.email, name: input.name },
  });

  const dbOrder = await getDb()
    .insert(orders)
    .values({
      razorpayOrderId: order.id,
      amount: order.amount,
      currency: order.currency,
      status: "created",
      customerName: input.name,
      customerEmail: input.email,
      customerPhone: input.phone,
      addressLine1: input.addressLine1,
      addressLine2: input.addressLine2 ?? null,
      city: input.city,
      state: input.state,
      postalCode: input.postalCode,
    })
    .returning({ id: orders.id });

  const dbOrderId = dbOrder[0].id;

  await getDb().insert(orderItems).values(
    lines.map((line) => ({
      orderId: dbOrderId,
      artworkId: line.artwork.id,
      title: line.artwork.title,
      medium: line.artwork.medium,
      price: line.artwork.price ?? 0,
      quantity: line.quantity,
    })),
  );

  return {
    keyId: process.env.RAZORPAY_KEY_ID,
    razorpayOrderId: order.id,
    amountPaise: order.amount,
    currency: order.currency,
    dbOrderId,
  };
}

/** Marks the DB order paid + clears the cart (client-facing confirmation). */
export async function confirmPaidOrder({
  razorpayPaymentId,
  dbOrderId,
}: {
  razorpayPaymentId: string;
  dbOrderId: string;
}) {
  if (!isDatabaseConfigured()) return { ok: false };
  await getDb()
    .update(orders)
    .set({
      status: "paid",
      razorpayPaymentId,
      paidAt: new Date(),
    })
    .where(eq(orders.id, dbOrderId));
  await clearCart();
  return { ok: true };
}

/** Fetches an order for the success page. */
export async function getOrderById(id: string) {
  if (!isDatabaseConfigured()) return null;
  const [order] = await getDb()
    .select()
    .from(orders)
    .where(eq(orders.id, id))
    .limit(1);
  return order ?? null;
}