import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/session";
import { formatINR, orderStatusLabel } from "@/lib/orders";
import { getAdminOrder, shippingStatusLabel } from "@/lib/admin/orders";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PrintButton } from "../PrintButton";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderInvoicePage({ params }: PageProps) {
  await requireAdmin();
  const { id } = await params;
  const order = await getAdminOrder(id);
  if (!order) notFound();

  const placedAt = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(order.createdAt));

  return (
    <div className="mx-auto max-w-3xl print:max-w-none">
      <div className="mb-6 flex items-center justify-between print:hidden">
        <Button asChild variant="ghost" size="sm">
          <Link href={`/admin/orders/${order.id}`}>← Back to order</Link>
        </Button>
        <PrintButton />
      </div>

      <div className="border border-border bg-background p-8 print:border-0 print:p-0">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-lg font-semibold tracking-tight text-foreground">
              ArtBlush — Studio
            </p>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Art, drawn with feeling
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-light tracking-tight text-foreground">
              Invoice
            </p>
            <p className="text-sm text-muted-foreground">
              #{order.id.slice(0, 8).toUpperCase()}
            </p>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="grid gap-6 text-sm sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Billed to
            </p>
            <p className="mt-2 font-medium text-foreground">
              {order.customerName}
            </p>
            <p className="text-muted-foreground">{order.customerEmail}</p>
            <p className="text-muted-foreground">{order.customerPhone}</p>
          </div>
          <div className="sm:text-right">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Order details
            </p>
            <p className="mt-2 text-foreground">Placed {placedAt}</p>
            <p className="text-muted-foreground">
              {orderStatusLabel(order.status)} ·{" "}
              {shippingStatusLabel(order.shippingStatus)}
            </p>
            <p className="text-muted-foreground">
              Payment ref: {order.razorpayOrderId}
            </p>
          </div>
        </div>

        <div className="mt-6 text-sm">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Ship to
          </p>
          <p className="mt-2 leading-relaxed text-foreground">
            {order.addressLine1}
            {order.addressLine2 ? <br /> : null}
            {order.addressLine2 ? order.addressLine2 : null}
            {order.addressLine2 ? <br /> : null}
            {order.city}, {order.state} — {order.postalCode}
          </p>
        </div>

        <div className="mt-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-[0.14em] text-muted-foreground">
                <th className="py-2 font-medium">Piece</th>
                <th className="py-2 text-right font-medium">Qty</th>
                <th className="py-2 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id} className="border-b border-border/60">
                  <td className="py-3 text-foreground">
                    {item.title}
                    <span className="text-muted-foreground"> · {item.medium}</span>
                  </td>
                  <td className="py-3 text-right text-muted-foreground">
                    {item.quantity}
                  </td>
                  <td className="py-3 text-right font-medium text-foreground">
                    {formatINR(item.price * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-sm font-medium text-foreground">Total</span>
            <span className="text-xl font-semibold tracking-tight text-foreground">
              {formatINR(order.amount)}
            </span>
          </div>
        </div>

        <Separator className="my-8" />

        <p className="text-sm text-foreground">
          Thank you for trusting ArtBlush with a piece of your story. Each
          original arrives signed and framed, with a certificate of authenticity.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          ArtBlush Studio · hello.artblush@gmail.com · www.artblush.in
        </p>
      </div>
    </div>
  );
}