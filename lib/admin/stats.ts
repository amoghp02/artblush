import "server-only";

import { sql } from "drizzle-orm";
import { getDb, isDatabaseConfigured } from "@/db";

export interface SalesDay {
  day: string; // YYYY-MM-DD
  revenuePaise: number;
  orderCount: number;
}

const DAY_MS = 24 * 60 * 60 * 1000;

export async function getSalesLast30Days(): Promise<SalesDay[]> {
  if (!isDatabaseConfigured()) return [];

  const result = await getDb().execute(sql`
    SELECT to_char(date_trunc('day', created_at), 'YYYY-MM-DD') AS day,
           count(*)::int AS order_count,
           coalesce(sum(amount), 0)::int AS revenue
    FROM orders
    WHERE status = 'paid' AND created_at >= now() - interval '30 days'
    GROUP BY 1
  `);

  const byDay = new Map<string, SalesDay>();
  for (const row of result.rows) {
    byDay.set(String(row.day), {
      day: String(row.day),
      orderCount: Number(row.order_count),
      revenuePaise: Number(row.revenue),
    });
  }

  const days: SalesDay[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; i < 30; i++) {
    const d = new Date(today.getTime() - (29 - i) * DAY_MS);
    const key = d.toISOString().slice(0, 10);
    days.push(byDay.get(key) ?? { day: key, revenuePaise: 0, orderCount: 0 });
  }
  return days;
}

export interface TopPiece {
  title: string;
  medium: string;
  quantity: number;
  revenuePaise: number;
}

export async function getTopPieces(limit = 5): Promise<TopPiece[]> {
  if (!isDatabaseConfigured()) return [];

  const result = await getDb().execute(sql`
    SELECT oi.title, oi.medium,
           sum(oi.quantity)::int AS quantity,
           sum(oi.price * oi.quantity)::int AS revenue
    FROM order_items oi
    JOIN orders o ON o.id = oi.order_id
    WHERE o.status = 'paid'
    GROUP BY oi.title, oi.medium
    ORDER BY revenue DESC
    LIMIT ${limit}
  `);

  return result.rows.map((row) => ({
    title: String(row.title),
    medium: String(row.medium),
    quantity: Number(row.quantity),
    revenuePaise: Number(row.revenue),
  }));
}

export interface MonthRevenue {
  key: string; // YYYY-MM
  label: string;
  revenuePaise: number;
  orderCount: number;
}

const MONTHS_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export async function getRevenueMonthly(months = 12): Promise<MonthRevenue[]> {
  if (!isDatabaseConfigured()) return [];

  const result = await getDb().execute(sql`
    SELECT to_char(date_trunc('month', created_at), 'YYYY-MM') AS month,
           coalesce(sum(amount), 0)::int AS revenue,
           count(*)::int AS order_count
    FROM orders
    WHERE status = 'paid'
      AND created_at >= date_trunc('month', now()) - (${months} - 1) * interval '1 month'
    GROUP BY 1
  `);

  const byMonth = new Map<string, { revenue: number; count: number }>();
  for (const row of result.rows) {
    byMonth.set(String(row.month), {
      revenue: Number(row.revenue),
      count: Number(row.order_count),
    });
  }

  const out: MonthRevenue[] = [];
  const now = new Date();
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const entry = byMonth.get(key);
    out.push({
      key,
      label: `${MONTHS_LABELS[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`,
      revenuePaise: entry?.revenue ?? 0,
      orderCount: entry?.count ?? 0,
    });
  }
  return out;
}

export interface MediumRevenue {
  medium: string;
  revenuePaise: number;
  quantity: number;
}

export async function getRevenueByMedium(): Promise<MediumRevenue[]> {
  if (!isDatabaseConfigured()) return [];

  const result = await getDb().execute(sql`
    SELECT oi.medium,
           sum(oi.price * oi.quantity)::int AS revenue,
           sum(oi.quantity)::int AS quantity
    FROM order_items oi
    JOIN orders o ON o.id = oi.order_id
    WHERE o.status = 'paid'
    GROUP BY oi.medium
    ORDER BY revenue DESC
  `);

  return result.rows.map((row) => ({
    medium: String(row.medium),
    revenuePaise: Number(row.revenue),
    quantity: Number(row.quantity),
  }));
}

export interface OrderStatusRow {
  status: string;
  orderCount: number;
}

export async function getOrderStatusBreakdown(): Promise<OrderStatusRow[]> {
  if (!isDatabaseConfigured()) return [];

  const result = await getDb().execute(sql`
    SELECT status, count(*)::int AS order_count
    FROM orders
    GROUP BY status
    ORDER BY order_count DESC
  `);

  return result.rows.map((row) => ({
    status: String(row.status),
    orderCount: Number(row.order_count),
  }));
}