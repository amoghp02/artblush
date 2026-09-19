import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth/session";
import { formatINR, getOrdersForUser, orderStatusLabel } from "@/lib/orders";

export const metadata: Metadata = {
  title: "Your orders — ArtBlush",
  description: "View your ArtBlush order history.",
};

export default async function OrdersPage() {
  const user = await requireUser("/account");
  const orders = await getOrdersForUser(user.id);

  if (orders.length === 0) {
    return (
      <div>
        <h2 className="text-[11px] font-medium uppercase tracking-[0.28em] text-foreground/45">
          Order history
        </h2>
        <p className="mt-6 text-sm leading-relaxed text-foreground/60">
          You don&apos;t have any orders yet.{" "}
          <Link
            href="/portfolio"
            className="text-accent underline-offset-4 hover:underline"
          >
            Browse the portfolio
          </Link>{" "}
          to find a piece you love.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-[11px] font-medium uppercase tracking-[0.28em] text-foreground/45">
        Order history
      </h2>
      <ul className="mt-6 divide-y divide-foreground/10 border-y border-foreground/10">
        {orders.map((order) => (
          <li key={order.id}>
            <Link
              href={`/account/orders/${order.id}`}
              className="group grid gap-3 py-5 sm:grid-cols-[1fr_auto] sm:items-baseline"
            >
              <div>
                <p className="text-sm font-medium text-foreground group-hover:text-accent">
                  Order {order.id.slice(0, 8)}
                  <span className="ml-3 text-foreground/45">
                    {order.itemCount > 1
                      ? `${order.itemCount} artworks`
                      : `${order.itemCount} artwork`}
                  </span>
                </p>
                <p className="mt-1 text-xs text-foreground/50">
                  {new Intl.DateTimeFormat("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(order.createdAt))}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-foreground">{formatINR(order.amount)}</p>
                <p className="mt-1 text-xs text-foreground/50">
                  {orderStatusLabel(order.status)}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}