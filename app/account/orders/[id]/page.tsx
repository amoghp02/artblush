import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import OrderStatusTimeline from "@/components/OrderStatusTimeline";
import { requireUser } from "@/lib/auth/session";
import {
  formatINR,
  getOrderForUser,
  orderStatusLabel,
} from "@/lib/orders";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Order details — ArtBlush",
  description: "Order details and delivery information.",
};

export default async function OrderDetailPage({ params }: PageProps) {
  const { id } = await params;
  const user = await requireUser(`/account/orders/${id}`);
  const order = await getOrderForUser(id, user.id);

  if (!order) notFound();

  const placedAt = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date(order.createdAt));

  return (
    <div className="max-w-3xl">
      <Link
        href="/account/orders"
        className="text-[13px] font-medium uppercase tracking-[0.18em] text-accent underline-offset-4 hover:underline"
      >
        ← All orders
      </Link>

      <div className="mt-8 flex flex-wrap items-baseline justify-between gap-4">
        <div>
          <h2 className="text-[11px] font-medium uppercase tracking-[0.28em] text-foreground/45">
            Order {order.id.slice(0, 8)}
          </h2>
          <p className="mt-1 text-sm text-foreground/60">{placedAt}</p>
        </div>
        <span
          className={`inline-flex items-center px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] ${
            order.status === "paid"
              ? "bg-accent/10 text-accent"
              : order.status === "created"
                ? "bg-foreground/5 text-foreground/70"
                : "bg-foreground/5 text-foreground/55"
          }`}
        >
          {orderStatusLabel(order.status)}
        </span>
      </div>

      <div className="mt-10 rounded-sm border border-foreground/10 bg-[#efe9dc] p-8">
        <h3 className="text-[11px] font-medium uppercase tracking-[0.28em] text-foreground/45">
          Order status
        </h3>
        <div className="mt-6">
          <OrderStatusTimeline
            status={order.status}
            shippingStatus={order.shippingStatus}
            trackingNumber={order.trackingNumber ?? undefined}
            trackingCarrier={order.trackingCarrier ?? undefined}
          />
        </div>
      </div>

      <div className="mt-10 grid gap-10 sm:grid-cols-2">
        <div>
          <h3 className="text-[11px] font-medium uppercase tracking-[0.28em] text-foreground/45">
            Delivery details
          </h3>
          <p className="mt-4 text-sm leading-relaxed text-foreground/80">
            {order.customerName}
            <br />
            {order.addressLine1}
            {order.addressLine2 && (
              <>
                <br />
                {order.addressLine2}
              </>
            )}
            <br />
            {order.city}, {order.state} — {order.postalCode}
          </p>
        </div>
        <div>
          <h3 className="text-[11px] font-medium uppercase tracking-[0.28em] text-foreground/45">
            Contact
          </h3>
          <p className="mt-4 text-sm leading-relaxed text-foreground/80">
            {order.customerEmail}
            <br />
            {order.customerPhone}
          </p>
          {order.razorpayPaymentId && (
            <>
              <h3 className="mt-8 text-[11px] font-medium uppercase tracking-[0.28em] text-foreground/45">
                Payment
              </h3>
              <p className="mt-4 break-all text-sm leading-relaxed text-foreground/60">
                Razorpay payment ID: {order.razorpayPaymentId}
              </p>
            </>
          )}
        </div>
      </div>

      <h3 className="mt-12 text-[11px] font-medium uppercase tracking-[0.28em] text-foreground/45">
        Items
      </h3>
      <ul className="mt-4 divide-y divide-foreground/10 border-y border-foreground/10">
        {order.items.map((item) => (
          <li
            key={item.id}
            className="flex items-baseline justify-between gap-4 py-4 text-sm"
          >
            <span className="text-foreground/80">
              {item.title}
              <span className="text-foreground/45"> · {item.medium}</span>
              {item.quantity > 1 && (
                <span className="text-foreground/45"> × {item.quantity}</span>
              )}
            </span>
            <span className="shrink-0 text-foreground">
              {formatINR(item.price * item.quantity)}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-baseline justify-between">
        <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/60">
          Total
        </span>
        <span className="font-display text-xl font-light text-foreground">
          {formatINR(order.amount)}
        </span>
      </div>
    </div>
  );
}