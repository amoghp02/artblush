import Link from "next/link";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { ShieldCheck } from "lucide-react";
import { getDb, isDatabaseConfigured } from "@/db";
import { artworks, commissions } from "@/db/schema";
import { requireAdmin, SESSION_COOKIE } from "@/lib/auth/session";
import { formatINR, orderStatusLabel } from "@/lib/orders";
import {
  getAdminOrderSummaries,
} from "@/lib/admin/orders";
import {
  listActiveAdminSessions,
} from "@/lib/admin/sessions";
import { revokeAdminSessionAction } from "@/app/admin/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

export default async function AdminDashboardPage() {
  const user = await requireAdmin();
  const store = await cookies();
  const currentToken = store.get(SESSION_COOKIE)?.value;

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

  const activeSessions = await listActiveAdminSessions();

  const stats = [
    { label: "Total orders", value: String(orderSummaries.length) },
    { label: "Revenue (paid)", value: formatINR(revenuePaise) },
    { label: "Awaiting shipment", value: String(awaitingShipment) },
    { label: "Pieces sold", value: String(soldCount) },
    { label: "New commissions", value: String(newCommissions) },
  ];

  const recent = orderSummaries.slice(0, 8);

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Welcome back, {user.name}.
          </p>
        </div>
        <p className="hidden text-sm text-muted-foreground sm:block">
          {new Intl.DateTimeFormat("en-IN", { dateStyle: "full" }).format(
            new Date(),
          )}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold tracking-tight text-foreground">
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-sm font-semibold">
                Latest orders
              </CardTitle>
              <CardDescription className="text-xs">
                Most recent {recent.length} of {orderSummaries.length} orders.
              </CardDescription>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/orders">
                All orders
                <span aria-hidden>→</span>
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Payment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recent.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-medium text-foreground hover:text-accent hover:underline underline-offset-2"
                      >
                        #{order.id.slice(0, 8)}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {order.customerName}
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
                  </TableRow>
                ))}
                {recent.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="py-8 text-center text-muted-foreground"
                    >
                      No orders yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <ShieldCheck size={15} className="text-accent" />
              Active admin sessions
            </CardTitle>
            <CardDescription className="text-xs">
              {activeSessions.length} currently signed in as admin (the shared
              30-day token). Revoke any device you no longer trust.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activeSessions.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No active admin sessions — you shouldn’t be seeing this.
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {activeSessions.map((session) => (
                  <li
                    key={session.sessionId}
                    className="flex items-center justify-between gap-3 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {session.name}
                        {session.sessionId === currentToken && (
                          <span className="ml-2">
                            <Badge variant="secondary" className="text-[10px]">
                              This device
                            </Badge>
                          </span>
                        )}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {session.email} · signed in{" "}
                        {new Intl.DateTimeFormat("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }).format(new Date(session.createdAt))}
                      </p>
                      <p className="text-xs text-muted-foreground/70">
                        Expires{" "}
                        {new Intl.DateTimeFormat("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }).format(new Date(session.expiresAt))}
                      </p>
                    </div>
                    {session.sessionId !== currentToken ? (
                      <form action={revokeAdminSessionAction}>
                        <input
                          type="hidden"
                          name="id"
                          value={session.sessionId}
                        />
                        <Button
                          type="submit"
                          variant="outline"
                          size="sm"
                          className="text-muted-foreground"
                        >
                          Revoke
                        </Button>
                      </form>
                    ) : (
                      <span className="shrink-0 text-xs text-muted-foreground/60">
                        —{/* this session */}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {orderSummaries.some((o) => o.shippingStatus === "awaiting_shipment" && o.status === "paid") && (
        <Card className="border-accent/40 bg-accent/5">
          <CardContent className="flex items-center justify-between gap-4 py-4">
            <p className="text-sm text-foreground">
              <span className="font-medium">
                {paidOrders.filter((o) => o.shippingStatus === "awaiting_shipment")
                  .length}{" "}
                paid order
                {paidOrders.filter((o) => o.shippingStatus === "awaiting_shipment")
                  .length > 1
                  ? "s"
                  : ""}{" "}
                awaiting shipment
              </span>{" "}
              — mark them shipped so buyers get tracking emails.
            </p>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/orders">Ship →</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}