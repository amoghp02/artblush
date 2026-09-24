import Link from "next/link";
import { requireAdmin } from "@/lib/auth/session";
import { formatINR, orderStatusLabel } from "@/lib/orders";
import {
  getAdminOrderSummaries,
  shippingStatusLabel,
} from "@/lib/admin/orders";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  await requireAdmin();
  const orders = await getAdminOrderSummaries();

  return (
    <div className="overflow-x-auto border border-foreground/10 bg-[#f7f3ea]">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-foreground/10 text-[11px] uppercase tracking-[0.18em] text-foreground/45">
          <tr>
            <th className="px-5 py-3.5 font-medium">Order</th>
            <th className="px-5 py-3.5 font-medium">Date</th>
            <th className="px-5 py-3.5 font-medium">Customer</th>
            <th className="px-5 py-3.5 font-medium">Items</th>
            <th className="px-5 py-3.5 font-medium">Total</th>
            <th className="px-5 py-3.5 font-medium">Payment</th>
            <th className="px-5 py-3.5 font-medium">Shipping</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-foreground/10">
          {orders.map((order) => (
            <tr key={order.id} className="transition-colors hover:bg-foreground/[0.02]">
              <td className="px-5 py-4">
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="font-medium text-accent underline-offset-4 hover:underline"
                >
                  #{order.id.slice(0, 8)}
                </Link>
              </td>
              <td className="px-5 py-4 whitespace-nowrap text-foreground/70">
                {new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(
                  new Date(order.createdAt),
                )}
              </td>
              <td className="px-5 py-4 text-foreground/75">{order.customerName}</td>
              <td className="px-5 py-4 text-foreground/70">{order.itemCount}</td>
              <td className="px-5 py-4 text-foreground/75">{formatINR(order.amount)}</td>
              <td className="px-5 py-4">
                <span
                  className={`inline-flex px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.12em] ${
                    order.status === "paid"
                      ? "bg-accent/10 text-accent"
                      : order.status === "created"
                        ? "bg-foreground/5 text-foreground/70"
                        : "bg-foreground/5 text-foreground/55"
                  }`}
                >
                  {orderStatusLabel(order.status)}
                </span>
              </td>
              <td className="px-5 py-4 text-foreground/75">
                {shippingStatusLabel(order.shippingStatus)}
              </td>
            </tr>
          ))}
          {orders.length === 0 && (
            <tr>
              <td colSpan={7} className="px-5 py-10 text-center text-foreground/50">
                No orders yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}