import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/session";
import { formatINR, orderStatusLabel } from "@/lib/orders";
import { getAdminOrder, shippingStatusLabel } from "@/lib/admin/orders";
import {
  updateOrderStatusAction,
  updateShippingAction,
} from "@/app/admin/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface PageProps {
  params: Promise<{ id: string }>;
}

const selectClasses =
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

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
    <div className="max-w-5xl space-y-6">
      <div>
        <Link
          href="/admin/orders"
          className="text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          ← All orders
        </Link>
        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              Order #{order.id.slice(0, 8)}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{placedAt}</p>
          </div>
          <div className="flex gap-2">
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
            <Badge variant="outline">
              {shippingStatusLabel(order.shippingStatus)}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Payment status</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={updateOrderStatusAction} className="space-y-4">
                <input type="hidden" name="orderId" value={order.id} />
                <div className="space-y-1.5">
                  <Label htmlFor="status" className="text-xs text-muted-foreground">
                    Status
                  </Label>
                  <select
                    id="status"
                    name="status"
                    defaultValue={order.status}
                    className={selectClasses}
                  >
                    <option value="created">Payment pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Payment failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
                <Button type="submit">Update payment</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Shipping & tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={updateShippingAction} className="space-y-4">
                <input type="hidden" name="orderId" value={order.id} />
                <div className="space-y-1.5">
                  <Label htmlFor="shippingStatus" className="text-xs text-muted-foreground">
                    Shipping status
                  </Label>
                  <select
                    id="shippingStatus"
                    name="shippingStatus"
                    defaultValue={order.shippingStatus}
                    className={selectClasses}
                  >
                    <option value="awaiting_shipment">Awaiting shipment</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="returned">Returned</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="trackingCarrier" className="text-xs text-muted-foreground">
                    Carrier
                  </Label>
                  <Input
                    id="trackingCarrier"
                    name="trackingCarrier"
                    type="text"
                    placeholder="e.g. Blue Dart"
                    defaultValue={order.trackingCarrier ?? ""}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="trackingNumber" className="text-xs text-muted-foreground">
                    Tracking number
                  </Label>
                  <Input
                    id="trackingNumber"
                    name="trackingNumber"
                    type="text"
                    placeholder="e.g. 19202413874115"
                    defaultValue={order.trackingNumber ?? ""}
                  />
                </div>
                <Button type="submit">Update shipping</Button>
              </form>
              <p className="mt-4 text-xs text-muted-foreground">
                Marking an order “Shipped” emails the customer with the tracking
                details.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Customer</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-foreground">
              {order.customerName}
              <br />
              {order.customerEmail}
              <br />
              {order.customerPhone}
              <Separator className="my-4" />
              <p className="font-medium text-foreground">
                {order.city}, {order.state} — {order.postalCode}
              </p>
              <p className="mt-1">
                {order.addressLine1}
                {order.addressLine2 && (
                  <>
                    <br />
                    {order.addressLine2}
                  </>
                )}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Items</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="divide-y divide-border text-sm">
                {order.items.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-baseline justify-between gap-4 py-3"
                  >
                    <span className="text-foreground">
                      {item.title}
                      <span className="text-muted-foreground"> · {item.medium}</span>
                      {item.quantity > 1 && (
                        <span className="text-muted-foreground">
                          {" "}
                          × {item.quantity}
                        </span>
                      )}
                    </span>
                    <span className="shrink-0 font-medium">
                      {formatINR(item.price * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-2 flex items-baseline justify-between border-t border-border pt-4">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Total
                </span>
                <span className="text-lg font-semibold text-foreground">
                  {formatINR(order.amount)}
                </span>
              </div>
              {order.razorpayOrderId && (
                <p className="mt-4 break-all text-xs text-muted-foreground">
                  Razorpay: {order.razorpayOrderId}
                  {order.razorpayPaymentId ? ` · ${order.razorpayPaymentId}` : ""}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}