import "server-only";

import { count as countFn, desc, eq, inArray } from "drizzle-orm";
import { getDb, isDatabaseConfigured } from "@/db";
import { orderItems, orders } from "@/db/schema";
import type { OrderRow, OrderItemRow } from "@/db/schema";

export interface OrderWithItems extends OrderRow {
  items: OrderItemRow[];
}

export interface OrderSummary extends OrderRow {
  itemCount: number;
}

export async function getOrdersForUser(userId: string): Promise<OrderSummary[]> {
  if (!isDatabaseConfigured()) return [];

  const rows = await getDb()
    .select()
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt));

  if (rows.length === 0) return [];

  const counts = await getDb()
    .select({ orderId: orderItems.orderId, count: countFn() })
    .from(orderItems)
    .where(inArray(orderItems.orderId, rows.map((row) => row.id)))
    .groupBy(orderItems.orderId);

  const countByOrder = new Map(counts.map((c) => [c.orderId, c.count]));

  return rows.map((order) => ({
    ...order,
    itemCount: countByOrder.get(order.id) ?? 0,
  }));
}

export async function getOrderForUser(
  orderId: string,
  userId: string,
): Promise<OrderWithItems | null> {
  if (!isDatabaseConfigured()) return null;

  const [order] = await getDb()
    .select()
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1);
  if (!order || order.userId !== userId) return null;

  const items = await getDb()
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, order.id))
    .orderBy(orderItems.title);

  return { ...order, items };
}

export function orderStatusLabel(status: OrderRow["status"]): string {
  switch (status) {
    case "created":
      return "Payment pending";
    case "paid":
      return "Paid";
    case "failed":
      return "Payment failed";
    case "refunded":
      return "Refunded";
    default:
      return status;
  }
}

export function formatINR(paise: number): string {
  return `₹${(paise / 100).toLocaleString("en-IN")}`;
}