import Link from "next/link";
import { requireAdmin } from "@/lib/auth/session";
import { formatINR, orderStatusLabel } from "@/lib/orders";
import {
  getAdminOrderSummaries,
  shippingStatusLabel,
} from "@/lib/admin/orders";
import { AdminFilters } from "@/app/admin/AdminFilters";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    payment?: string;
    shipping?: string;
    sort?: string;
  }>;
}

export default async function AdminOrdersPage({ searchParams }: PageProps) {
  await requireAdmin();
  const { payment, shipping, sort } = await searchParams;

  const orders = await getAdminOrderSummaries({
    paymentStatus: (["paid", "created", "failed", "refunded"] as const).includes(
      payment as "paid",
    )
      ? (payment as "paid" | "created" | "failed" | "refunded")
      : undefined,
    shippingStatus: (
      ["awaiting_shipment", "shipped", "delivered", "returned"] as const
    ).includes(shipping as "shipped")
      ? (shipping as "awaiting_shipment" | "shipped" | "delivered" | "returned")
      : undefined,
    sort: (["oldest", "amount_desc", "amount_asc"] as const).includes(
      sort as "oldest",
    )
      ? (sort as "oldest" | "amount_desc" | "amount_asc")
      : undefined,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Orders
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {orders.length} order{orders.length === 1 ? "" : "s"}
          {payment || shipping ? " matching your filters." : " in total."}
        </p>
      </div>

      <AdminFilters
        fields={[
          {
            key: "payment",
            label: "Payment",
            options: [
              { value: "paid", label: orderStatusLabel("paid") },
              { value: "created", label: orderStatusLabel("created") },
              { value: "failed", label: orderStatusLabel("failed") },
              { value: "refunded", label: orderStatusLabel("refunded") },
            ],
          },
          {
            key: "shipping",
            label: "Shipping",
            options: [
              { value: "awaiting_shipment", label: "Awaiting shipment" },
              { value: "shipped", label: "Shipped" },
              { value: "delivered", label: "Delivered" },
              { value: "returned", label: "Returned" },
            ],
          },
        ]}
        sortKey="sort"
        sortOptions={[
          { value: "", label: "Newest first" },
          { value: "oldest", label: "Oldest first" },
          { value: "amount_desc", label: "Total · high to low" },
          { value: "amount_asc", label: "Total · low to high" },
        ]}
      />

      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Order</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead className="text-right">Items</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Shipping</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">#{order.id.slice(0, 8)}</TableCell>
              <TableCell className="whitespace-nowrap text-muted-foreground">
                {new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(
                  new Date(order.createdAt),
                )}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {order.customerName}
              </TableCell>
              <TableCell className="text-right text-muted-foreground">
                {order.itemCount}
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatINR(order.amount)}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    order.status === "paid"
                      ? "default"
                      : order.status === "created"
                        ? "secondary"
                        : "destructive"
                  }
                >
                  {orderStatusLabel(order.status)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{shippingStatusLabel(order.shippingStatus)}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/admin/orders/${order.id}`}>Open</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {orders.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={8}
                className="py-10 text-center text-muted-foreground"
              >
                {payment || shipping
                  ? "No orders match these filters."
                  : "No orders yet."}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}