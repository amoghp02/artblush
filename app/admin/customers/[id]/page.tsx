import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/session";
import { formatINR, orderStatusLabel } from "@/lib/orders";
import { getAdminCustomer, getCustomerOrders } from "@/lib/admin/customers";
import { shippingStatusLabel } from "@/lib/admin/orders";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminCustomerDetailPage({ params }: PageProps) {
  await requireAdmin();
  const { id } = await params;
  const customer = await getAdminCustomer(id);
  if (!customer) notFound();

  const orders = await getCustomerOrders(id);
  const joined = new Intl.DateTimeFormat("en-IN", { dateStyle: "long" }).format(
    new Date(customer.createdAt),
  );

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <Link
          href="/admin/customers"
          className="text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          ← All customers
        </Link>
        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              {customer.name}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {customer.email}
              {customer.phone ? ` · ${customer.phone}` : ""}
            </p>
          </div>
          <Badge variant={customer.role === "admin" ? "default" : "outline"}>
            {customer.role}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Joined
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium text-foreground">{joined}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-foreground">
              {customer.orderCount}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Paid revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-foreground">
              {formatINR(customer.paidRevenuePaise)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Last order
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium text-foreground">
              {customer.lastOrderAt
                ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(
                    customer.lastOrderAt,
                  )
                : "—"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="min-w-0">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Order history</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="min-w-[640px]">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Order</TableHead>
                  <TableHead>Date</TableHead>
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
                    <TableCell className="font-medium">
                      #{order.id.slice(0, 8)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(
                        new Date(order.createdAt),
                      )}
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
                    <TableCell className="text-muted-foreground">
                      {shippingStatusLabel(
                        order.shippingStatus as Parameters<typeof shippingStatusLabel>[0],
                      )}
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
                    <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                      No orders yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}