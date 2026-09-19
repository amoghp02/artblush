import Link from "next/link";
import { requireUser } from "@/lib/auth/session";
import { formatINR, getOrdersForUser, orderStatusLabel } from "@/lib/orders";

export default async function AccountPage() {
  const user = await requireUser("/account");
  const orders = await getOrdersForUser(user.id);
  const recent = orders.slice(0, 3);

  return (
    <div className="grid gap-14 lg:grid-cols-[1fr_1.2fr]">
      <div>
        <h2 className="text-[11px] font-medium uppercase tracking-[0.28em] text-foreground/45">
          Profile
        </h2>
        <dl className="mt-6 space-y-4 text-sm">
          <div>
            <dt className="text-foreground/45">Name</dt>
            <dd className="mt-0.5 text-foreground">{user.name}</dd>
          </div>
          <div>
            <dt className="text-foreground/45">Email</dt>
            <dd className="mt-0.5 text-foreground">{user.email}</dd>
          </div>
          <div>
            <dt className="text-foreground/45">Phone</dt>
            <dd className="mt-0.5 text-foreground">{user.phone ?? "—"}</dd>
          </div>
        </dl>
        <Link
          href="/account/profile"
          className="mt-6 inline-block text-[13px] font-medium uppercase tracking-[0.18em] text-accent underline-offset-4 hover:underline"
        >
          Edit profile →
        </Link>
      </div>

      <div>
        <div className="flex items-baseline justify-between">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.28em] text-foreground/45">
            Recent orders
          </h2>
          <Link
            href="/account/orders"
            className="text-[13px] font-medium uppercase tracking-[0.18em] text-accent underline-offset-4 hover:underline"
          >
            View all →
          </Link>
        </div>

        {recent.length === 0 ? (
          <p className="mt-6 text-sm leading-relaxed text-foreground/60">
            You don&apos;t have any orders yet.{" "}
            <Link href="/portfolio" className="text-accent underline-offset-4 hover:underline">
              Browse the portfolio
            </Link>{" "}
            to find a piece you love.
          </p>
        ) : (
          <ul className="mt-6 divide-y divide-foreground/10 border-y border-foreground/10">
            {recent.map((order) => (
              <li key={order.id}>
                <Link
                  href={`/account/orders/${order.id}`}
                  className="group flex items-baseline justify-between gap-4 py-4"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground group-hover:text-accent">
                      {order.itemCount > 1
                        ? `Order · ${order.itemCount} artworks`
                        : `Order · ${order.itemCount} artwork`}
                    </p>
                    <p className="mt-0.5 text-xs text-foreground/50">
                      {new Intl.DateTimeFormat("en-IN", {
                        dateStyle: "medium",
                      }).format(new Date(order.createdAt))}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-foreground">{formatINR(order.amount)}</p>
                    <p className="mt-0.5 text-xs text-foreground/50">
                      {orderStatusLabel(order.status)}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}