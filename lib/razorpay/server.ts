import "server-only";

import Razorpay from "razorpay";
import { createHmac } from "node:crypto";

function getKeyId() {
  const key = process.env.RAZORPAY_KEY_ID;
  if (!key) throw new Error("RAZORPAY_KEY_ID is not set.");
  return key;
}

function getKeySecret() {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) throw new Error("RAZORPAY_KEY_SECRET is not set.");
  return secret;
}

export function getRazorpayClient() {
  return new Razorpay({
    key_id: getKeyId(),
    key_secret: getKeySecret(),
  });
}

export interface CreateOrderInput {
  amountPaise: number;
  currency: string;
  receipt: string;
  notes?: Record<string, string>;
}

/** Creates a Razorpay order (amount is in paise). */
export async function createRazorpayOrder({
  amountPaise,
  currency,
  receipt,
  notes,
}: CreateOrderInput) {
  const instance = getRazorpayClient();
  const order = await instance.orders.create({
    amount: amountPaise,
    currency,
    receipt,
    notes,
  });
  return order as {
    id: string;
    amount: number;
    currency: string;
  };
}

/**
 * Verifies a payment by recomputing the signature from key_secret.
 * Returns true when the signature matches Razorpay's expected value.
 */
export function verifyPaymentSignature({
  razorpayOrderId,
  razorpayPaymentId,
  signature,
}: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  signature: string;
}): boolean {
  const body = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expected = createHmac("sha256", getKeySecret()).update(body).digest("hex");
  return expected === signature;
}

/**
 * Verifies a webhook event payload. Returns true when the signature
 * matches a freshly computed HMAC over the raw body.
 */
export function verifyWebhookSignature(payload: string, signature?: string) {
  if (!signature) return false;
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return false;
  const expected = createHmac("sha256", secret).update(payload).digest("hex");
  return expected === signature;
}