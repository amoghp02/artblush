import Link from "next/link";
import { eq } from "drizzle-orm";
import { getDb, isDatabaseConfigured } from "@/db";
import { artworks, commissions } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/session";
import { formatINR, orderStatusLabel } from "@/lib/orders";
import {
  getAdminOrderSummaries,
  shippingStatusLabel,
} from "@/lib/admin/orders";

export default async function AdminDashboardPage() {
  await requireAdmin();

  const orderSummaries = await getAdminOrderSummaries();
  const paidOrders = orderSummaries.filter((o) => o.status === "paid");
  const revenuePaise = paidOrders.reduce((sum, o) => sum + o.amount, 0);
  const awaitingShipment = paidOrders.filter(
    (o) => o.shippingStatus === "awaiting_shipment",
  ).length;

  let soldCount = 0;
  let newCommissions = 0;
  if (isDatabaseConfigured()) {
    const soldRows = await getDb()
      .select({ id: artworks.id })
      .from(artworks)
      .where(eq(artworks.sold, true));
    soldCount = soldRows.length;

    const commRows = await getDb()
      .select({ id: commissions.id })
      .from(commissions)
      .where(eq(commissions.status, "new"));
    newCommissions = commRows.length;
  }

  const stats = [
    { label: "Total orders", value: String(orderSummaries.length) },
    { label: "Revenue (paid)", value: formatINR(revenuePaise) },
    {
      label: "Awaiting shipment",
      value: String(awaitingShipment),
    },
    { label: "Pieces sold", value: String(soldCount) },
    { label: "New commissions", value: String(newCommissions) },
  ];

  const recent = orderSummaries.slice(0, 8);

  return (
    <div className="space-y-16">
      <div className="grid gap-px overflow-hidden border border-foreground/10 bg-foreground/10 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-[#f7f3ea] p-6">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/45">
              {stat.label}
            </p>
            <p className="mt-2 font-display text-2xl font-light text-foreground">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-baseline justify-between">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.28em] text-foreground/45">
            Latest orders
          </h2>
          <Link
            href="/admin/orders"
            className="text-[13px] font-medium uppercase tracking-[0.18em] text-accent underline-offset-4 hover:underline"
          >
            All orders →
          </Link>
        </div>

        <div className="mt-6 overflow-x-auto border border-foreground/10 bg-[#f7f3ea]">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-foreground/10 text-[11px] uppercase tracking-[0.18em] text-foreground/45">
              <tr>
                <th className="px-5 py-3.5 font-medium">Order</th>
                <th className="px-5 py-3.5 font-medium">Customer</th>
                <th className="px-5 py-3.5 font-medium">Total</th>
                <th className="px-5 py-3.5 font-medium">Payment</th>
                <th className="px-5 py-3.5 font-medium">Shipping</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-foreground/10">
              {recent.map((order) => (
                <tr key={order.id} className="transition-colors hover:bg-foreground/[0.02]">
                  <td className="px-5 py-4">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-medium text-accent underline-offset-4 hover:underline"
                    >
                      #{order.id.slice(0, 8)}
                    </Link>
                  </td>
                  <td className="px-5 py-4 text-foreground/75">{order.customerName}</td>
                  <td className="px-5 py-4 text-foreground/75">{formatINR(order.amount)}</td>
                  <td className="px-5 py-4 text-foreground/75">
                    {orderStatusLabel(order.status)}
                  </td>
                  <td className="px-5 py-4 text-foreground/75">
                    {shippingStatusLabel(order.shippingStatus)}
                  </td>
                </tr>
              ))}
              {recent.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-foreground/50">
                    No orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}