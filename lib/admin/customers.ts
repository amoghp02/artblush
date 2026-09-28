import "server-only";

import { desc, eq, inArray, or, sql } from "drizzle-orm";
import { getDb, isDatabaseConfigured } from "@/db";
import { orderItems, orders, users } from "@/db/schema";
import type { UserRow } from "@/db/schema";

export interface AdminCustomer extends UserRow {
  orderCount: number;
  paidRevenuePaise: number;
  lastOrderAt: Date | null;
}

export async function getAdminCustomers(q?: string): Promise<AdminCustomer[]> {
  if (!isDatabaseConfigured()) return [];

  const query = getDb()
    .select()
    .from(users)
    .orderBy(desc(users.createdAt));

  if (q) {
    const like = `%${q}%`;
    query.where(
      or(
        sql`lower(${users.email}) like lower(${like})`,
        sql`lower(${users.name}) like lower(${like})`,
      ),
    );
  }

  const rows = await query;
  if (rows.length === 0) return [];

  const agg = await getDb()
    .select({
      userId: orders.userId,
      orderCount: sql<number>`count(*)::int`,
      paidRevenue:
        sql<number>`coalesce(sum(case when ${orders.status} = 'paid' then ${orders.amount} else 0 end), 0)::int`,
      lastOrderAt: sql<Date | null>`max(${orders.createdAt})`,
    })
    .from(orders)
    .where(inArray(orders.userId, rows.map((r) => r.id)))
    .groupBy(orders.userId);

  const byUser = new Map<string | null, (typeof agg)[number]>();
  for (const a of agg) byUser.set(a.userId, a);

  return rows.map((row) => {
    const a = byUser.get(row.id);
    return {
      ...row,
      orderCount: a?.orderCount ?? 0,
      paidRevenuePaise: a?.paidRevenue ?? 0,
      lastOrderAt: a?.lastOrderAt ? new Date(a.lastOrderAt) : null,
    };
  });
}

export async function getAdminCustomer(id: string): Promise<AdminCustomer | null> {
  if (!isDatabaseConfigured()) return null;
  const [user] = await getDb().select().from(users).where(eq(users.id, id)).limit(1);
  if (!user) return null;

  const [agg] = await getDb()
    .select({
      orderCount: sql<number>`count(*)::int`,
      paidRevenue:
        sql<number>`coalesce(sum(case when ${orders.status} = 'paid' then ${orders.amount} else 0 end), 0)::int`,
      lastOrderAt: sql<Date | null>`max(${orders.createdAt})`,
    })
    .from(orders)
    .where(eq(orders.userId, id));

  return {
    ...user,
    orderCount: agg?.orderCount ?? 0,
    paidRevenuePaise: agg?.paidRevenue ?? 0,
    lastOrderAt: agg?.lastOrderAt ? new Date(agg.lastOrderAt) : null,
  };
}

export async function getCustomerOrders(userId: string): Promise<
  {
    id: string;
    createdAt: Date;
    status: "created" | "paid" | "failed" | "refunded";
    shippingStatus: string;
    amount: number;
    itemCount: number;
  }[]
> {
  if (!isDatabaseConfigured()) return [];
  const rows = await getDb()
    .select({
      id: orders.id,
      createdAt: orders.createdAt,
      status: orders.status,
      shippingStatus: orders.shippingStatus,
      amount: orders.amount,
    })
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt));

  if (rows.length === 0) return [];

  const counts = await getDb()
    .select({ orderId: orderItems.orderId, qty: sql<number>`sum(${orderItems.quantity})::int` })
    .from(orderItems)
    .where(inArray(orderItems.orderId, rows.map((r) => r.id)))
    .groupBy(orderItems.orderId);

  const byOrder = new Map(counts.map((c) => [c.orderId, c.qty]));

  return rows.map((r) => ({
    ...r,
    shippingStatus: r.shippingStatus as string,
    itemCount: byOrder.get(r.id) ?? 0,
  }));
}