import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/session";
import { formatINR, orderStatusLabel } from "@/lib/orders";
import {
  getAdminOrder,
  shippingStatusLabel,
} from "@/lib/admin/orders";
import {
  updateOrderStatusAction,
  updateShippingAction,
} from "@/app/admin/actions";

interface PageProps {
  params: Promise<{ id: string }>;
}

const selectClasses =
  "w-full border border-foreground/15 bg-transparent px-3 py-2.5 text-sm text-foreground focus:border-accent focus:outline-none";
const inputClasses =
  "w-full border border-foreground/15 bg-transparent px-3 py-2.5 text-sm text-foreground focus:border-accent focus:outline-none";
const buttonClasses =
  "mt-4 inline-flex items-center justify-center px-5 py-2.5 text-[12px] font-medium uppercase tracking-[0.18em] text-background bg-foreground hover:bg-[#3a352c] transition-colors";

export default async function AdminOrderDetailPage({ params }: PageProps) {
  await requireAdmin();
  const { id } = await params;
  const order = await getAdminOrder(id);
  if (!order) notFound();

  const placedAt = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(order.createdAt));

  return (
    <div className="max-w-4xl space-y-14">
      <div>
        <Link
          href="/admin/orders"
          className="text-[13px] font-medium uppercase tracking-[0.18em] text-accent underline-offset-4 hover:underline"
        >
          ← All orders
        </Link>
        <div className="mt-6 flex flex-wrap items-baseline justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-light text-foreground">
              Order #{order.id.slice(0, 8)}
            </h2>
            <p className="mt-1 text-sm text-foreground/60">{placedAt}</p>
          </div>
          <div className="flex gap-2">
            <span className="inline-flex items-center px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.12em] bg-foreground/5 text-foreground/70">
              {orderStatusLabel(order.status)}
            </span>
            <span className="inline-flex items-center px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.12em] bg-foreground/5 text-foreground/70">
              {shippingStatusLabel(order.shippingStatus)}
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-12 lg:grid-cols-2">
        <div className="space-y-14">
          <div>
            <h3 className="text-[11px] font-medium uppercase tracking-[0.28em] text-foreground/45">
              Payment status
            </h3>
            <form action={updateOrderStatusAction} className="mt-4 max-w-xs">
              <input type="hidden" name="orderId" value={order.id} />
              <select
                name="status"
                defaultValue={order.status}
                className={selectClasses}
              >
                <option value="created">Payment pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Payment failed</option>
                <option value="refunded">Refunded</option>
              </select>
              <button type="submit" className={buttonClasses}>
                Update payment
              </button>
            </form>
          </div>

          <div>
            <h3 className="text-[11px] font-medium uppercase tracking-[0.28em] text-foreground/45">
              Shipping & tracking
            </h3>
            <form action={updateShippingAction} className="mt-4 space-y-4">
              <input type="hidden" name="orderId" value={order.id} />
              <select
                name="shippingStatus"
                defaultValue={order.shippingStatus}
                className={selectClasses}
              >
                <option value="awaiting_shipment">Awaiting shipment</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="returned">Returned</option>
              </select>
              <input
                name="trackingCarrier"
                type="text"
                placeholder="Carrier (e.g. Blue Dart)"
                defaultValue={order.trackingCarrier ?? ""}
                className={inputClasses}
              />
              <input
                name="trackingNumber"
                type="text"
                placeholder="Tracking number"
                defaultValue={order.trackingNumber ?? ""}
                className={inputClasses}
              />
              <button type="submit" className={buttonClasses}>
                Update shipping
              </button>
            </form>
            <p className="mt-3 text-xs leading-relaxed text-foreground/50">
              Marking an order “Shipped” emails the customer with the tracking
              details.
            </p>
          </div>
        </div>

        <div className="space-y-10">
          <div className="border border-foreground/10 bg-[#f7f3ea] p-6">
            <h3 className="text-[11px] font-medium uppercase tracking-[0.28em] text-foreground/45">
              Customer
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-foreground/80">
              {order.customerName}
              <br />
              {order.customerEmail}
              <br />
              {order.customerPhone}
            </p>
            <h3 className="mt-8 text-[11px] font-medium uppercase tracking-[0.28em] text-foreground/45">
              Ship to
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-foreground/80">
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

          <div className="border border-foreground/10 bg-[#f7f3ea] p-6">
            <h3 className="text-[11px] font-medium uppercase tracking-[0.28em] text-foreground/45">
              Items
            </h3>
            <ul className="mt-4 divide-y divide-foreground/10 text-sm">
              {order.items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-baseline justify-between gap-4 py-3"
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
            <div className="mt-4 flex items-baseline justify-between border-t border-foreground/10 pt-4">
              <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-foreground/60">
                Total
              </span>
              <span className="font-display text-lg font-light text-foreground">
                {formatINR(order.amount)}
              </span>
            </div>
            {order.razorpayOrderId && (
              <p className="mt-4 break-all text-xs text-foreground/50">
                Razorpay: {order.razorpayOrderId}
                {order.razorpayPaymentId ? ` · ${order.razorpayPaymentId}` : ""}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}