import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/session";
import { formatINR, orderStatusLabel } from "@/lib/orders";
import {
  getRevenueMonthly,
  getRevenueByMedium,
  getOrderStatusBreakdown,
  getTopPieces,
} from "@/lib/admin/stats";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CHART_COLORS, Donut } from "./Donut";

export const metadata: Metadata = {
  title: "Analytics — ArtBlush Studio",
  description: "ArtBlush studio — sales analytics.",
};

export default async function AdminAnalyticsPage() {
  await requireAdmin();

  const [monthly, byMedium, statusRows, top] = await Promise.all([
    getRevenueMonthly(),
    getRevenueByMedium(),
    getOrderStatusBreakdown(),
    getTopPieces(8),
  ]);

  const monthlyMax = Math.max(1, ...monthly.map((m) => m.revenuePaise));
  const monthlyTotal = monthly.reduce((sum, m) => sum + m.revenuePaise, 0);
  const mediumTotal = byMedium.reduce((sum, m) => sum + m.revenuePaise, 0);
  const statusTotal = statusRows.reduce((sum, s) => sum + s.orderCount, 0);
  const topMax = Math.max(1, ...top.map((t) => t.revenuePaise));

  const mediumSegments = byMedium.map((m, i) => ({
    label: m.medium,
    valueText: formatINR(m.revenuePaise),
    value: m.revenuePaise,
    color: CHART_COLORS[i % CHART_COLORS.length],
  }));

  const statusSegments = statusRows.map((s, i) => ({
    label: orderStatusLabel(s.status as "created" | "paid" | "failed" | "refunded"),
    valueText: String(s.orderCount),
    value: s.orderCount,
    color: CHART_COLORS[i % CHART_COLORS.length],
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Analytics
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sales trends from paid orders. Past 12 months.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="min-w-0">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-sm font-semibold">
                Revenue — past 12 months
              </CardTitle>
              <CardDescription className="text-xs">
                Paid orders, grouped by month.
              </CardDescription>
            </div>
            <p className="text-lg font-semibold tracking-tight text-foreground">
              {formatINR(monthlyTotal)}
            </p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="flex h-40 min-w-[720px] items-end gap-[6px]">
                {monthly.map((month) => {
                  const height =
                    month.revenuePaise > 0
                      ? Math.max(6, (month.revenuePaise / monthlyMax) * 100)
                      : 2;
                  return (
                    <div
                      key={month.key}
                      title={`${month.label} — ${formatINR(month.revenuePaise)} · ${month.orderCount} order${month.orderCount === 1 ? "" : "s"}`}
                      className="flex h-full flex-1 flex-col items-center justify-end"
                    >
                      <div
                        className={`w-full max-w-[26px] rounded-t-[2px] transition-opacity hover:opacity-80 ${
                          month.revenuePaise > 0 ? "bg-accent" : "bg-border"
                        }`}
                        style={{ height: `${height}%` }}
                      />
                      <span
                        className={`mt-1.5 whitespace-nowrap text-[10px] ${
                          month.revenuePaise > 0
                            ? "text-muted-foreground"
                            : "text-muted-foreground/50"
                        }`}
                      >
                        {month.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="min-w-0">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">
              Revenue by medium
            </CardTitle>
            <CardDescription className="text-xs">
              Where the studio earnings come from.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {byMedium.length > 0 ? (
              <Donut
                segments={mediumSegments}
                centerValue={formatINR(mediumTotal)}
                centerLabel="All time"
              />
            ) : (
              <p className="py-10 text-center text-sm text-muted-foreground">
                No paid orders yet.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="min-w-0">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Top pieces</CardTitle>
            <CardDescription className="text-xs">
              Best-selling artworks by paid revenue.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {top.length > 0 ? (
              <ul className="space-y-3">
                {top.map((piece, i) => (
                  <li key={piece.title} className="text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <span className="min-w-0 truncate font-medium text-foreground">
                        <span className="mr-2 text-xs text-muted-foreground">
                          #{i + 1}
                        </span>
                        {piece.title}
                        <span className="text-muted-foreground">
                          {" "}· {piece.medium}
                          {piece.quantity > 1 ? ` × ${piece.quantity}` : ""}
                        </span>
                      </span>
                      <span className="shrink-0 font-medium text-foreground">
                        {formatINR(piece.revenuePaise)}
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-border">
                      <div
                        className="h-full rounded-full bg-accent"
                        style={{ width: `${(piece.revenuePaise / topMax) * 100}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-10 text-center text-sm text-muted-foreground">
                No paid orders yet.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="min-w-0">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Orders by status</CardTitle>
            <CardDescription className="text-xs">
              Payment state across every order.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {statusRows.length > 0 ? (
              <Donut
                segments={statusSegments}
                centerValue={String(statusTotal)}
                centerLabel="Orders"
              />
            ) : (
              <p className="py-10 text-center text-sm text-muted-foreground">
                No orders yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}