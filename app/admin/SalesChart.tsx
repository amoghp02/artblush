import { formatINR } from "@/lib/orders";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { SalesDay, TopPiece } from "@/lib/admin/stats";

export function SalesChart({
  days,
  top,
}: {
  days: SalesDay[];
  top: TopPiece[];
}) {
  const maxRevenue = Math.max(1, ...days.map((d) => d.revenuePaise));
  const totalRevenue = days.reduce((sum, d) => sum + d.revenuePaise, 0);
  const totalOrders = days.reduce((sum, d) => sum + d.orderCount, 0);
  const peak = days.find((d) => d.revenuePaise === maxRevenue);

  return (
    <Card className="min-w-0">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-sm font-semibold">
            Sales — last 30 days
          </CardTitle>
          <CardDescription className="text-xs">
            Paid orders only.
          </CardDescription>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold tracking-tight text-foreground">
            {formatINR(totalRevenue)}
          </p>
          <p className="text-xs text-muted-foreground">
            {totalOrders} order{totalOrders === 1 ? "" : "s"}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="flex h-40 min-w-[720px] items-end gap-[4px]">
            {days.map((day) => {
              const height =
                day.revenuePaise > 0
                  ? Math.max(6, (day.revenuePaise / maxRevenue) * 100)
                  : 2;
              return (
                <div
                  key={day.day}
                  title={`${day.day} — ${formatINR(day.revenuePaise)} · ${day.orderCount} order${day.orderCount === 1 ? "" : "s"}`}
                  className={`flex-1 rounded-t-[2px] transition-opacity hover:opacity-80 ${
                    day.revenuePaise > 0 ? "bg-accent" : "bg-border"
                  }`}
                  style={{ height: `${height}%` }}
                />
              );
            })}
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
          <span>{days[0]?.day}</span>
          <span className="hidden sm:inline">
            {peak && peak.revenuePaise > 0
              ? `Best day ${peak.day} • ${formatINR(peak.revenuePaise)}`
              : "No sales in this period"}
          </span>
          <span>{days[days.length - 1]?.day}</span>
        </div>

        {top.length > 0 && (
          <>
            <div className="my-4 border-t border-border" />
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Top pieces sold
            </p>
            <ul className="mt-2 divide-y divide-border">
              {top.map((piece, i) => (
                <li
                  key={piece.title}
                  className="flex items-center justify-between gap-4 py-2.5 text-sm"
                >
                  <span className="min-w-0">
                    <span className="mr-2 text-xs text-muted-foreground">
                      #{i + 1}
                    </span>
                    <span className="truncate font-medium text-foreground">
                      {piece.title}
                    </span>
                    <span className="text-muted-foreground">
                      {" "}· {piece.medium}
                      {piece.quantity > 1 ? ` × ${piece.quantity}` : ""}
                    </span>
                  </span>
                  <span className="shrink-0 font-medium text-foreground">
                    {formatINR(piece.revenuePaise)}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </CardContent>
    </Card>
  );
}