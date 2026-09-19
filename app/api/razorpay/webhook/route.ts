import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb, isDatabaseConfigured } from "@/db";
import { orders } from "@/db/schema";
import { verifyWebhookSignature } from "@/lib/razorpay/server";

interface RazorpayWebhookEvent {
  event: string;
  payload: {
    payment?: {
      entity?: {
        id?: string;
        order_id?: string;
        status?: string;
      };
    };
  };
}

export async function POST(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "Payments not configured" }, { status: 503 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature") ?? undefined;

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let event: RazorpayWebhookEvent;
  try {
    event = JSON.parse(rawBody) as RazorpayWebhookEvent;
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (
    event.event === "payment.captured" ||
    event.event === "order.paid"
  ) {
    const orderId = event.payload.payment?.entity?.order_id;
    const paymentId = event.payload.payment?.entity?.id;

    if (orderId) {
      await getDb()
        .update(orders)
        .set({
          status: "paid",
          razorpayPaymentId: paymentId ?? null,
          paidAt: new Date(),
        })
        .where(eq(orders.razorpayOrderId, orderId));
    }
  }

  return NextResponse.json({ received: true });
}