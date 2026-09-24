import Link from "next/link";
import { requireAdmin } from "@/lib/auth/session";
import { formatINR, orderStatusLabel } from "@/lib/orders";
import {
  getAdminOrderSummaries,
  shippingStatusLabel,
} from "@/lib/admin/orders";
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

export default async function AdminOrdersPage() {
  await requireAdmin();
  const orders = await getAdminOrderSummaries();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Orders
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {orders.length} order{orders.length === 1 ? "" : "s"} in total.
        </p>
      </div>

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
                No orders yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}