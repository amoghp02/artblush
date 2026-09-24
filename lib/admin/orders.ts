import "server-only";

import { and, asc, desc, eq, inArray } from "drizzle-orm";
import { getDb, isDatabaseConfigured } from "@/db";
import { orderItems, orders } from "@/db/schema";
import type { OrderItemRow, OrderRow } from "@/db/schema";

export interface AdminOrderSummary extends OrderRow {
  itemCount: number;
}

export interface AdminOrderWithItems extends OrderRow {
  items: OrderItemRow[];
}

export type OrderFilter = {
  paymentStatus?: OrderRow["status"];
  shippingStatus?: OrderRow["shippingStatus"];
  sort?: "newest" | "oldest" | "amount_desc" | "amount_asc";
};

export function orderSortLabel(sort: string): string {
  switch (sort) {
    case "oldest":
      return "Oldest first";
    case "amount_desc":
      return "Total · high to low";
    case "amount_asc":
      return "Total · low to high";
    default:
      return "Newest first";
  }
}

export async function getAdminOrderSummaries(
  filter: OrderFilter = {},
): Promise<AdminOrderSummary[]> {
  if (!isDatabaseConfigured()) return [];

  const conditions = [];
  if (filter.paymentStatus) conditions.push(eq(orders.status, filter.paymentStatus));
  if (filter.shippingStatus)
    conditions.push(eq(orders.shippingStatus, filter.shippingStatus));

  const orderBy =
    filter.sort === "oldest"
      ? asc(orders.createdAt)
      : filter.sort === "amount_desc"
        ? desc(orders.amount)
        : filter.sort === "amount_asc"
          ? asc(orders.amount)
          : desc(orders.createdAt);

  const rows = await getDb()
    .select()
    .from(orders)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(orderBy);

  if (rows.length === 0) return [];

  const counts = await getDb()
    .select({ orderId: orderItems.orderId, count: orderItems.quantity })
    .from(orderItems)
    .where(inArray(orderItems.orderId, rows.map((row) => row.id)));

  const countByOrder = new Map<string, number>();
  for (const c of counts) {
    countByOrder.set(c.orderId, (countByOrder.get(c.orderId) ?? 0) + c.count);
  }

  return rows.map((order) => ({
    ...order,
    itemCount: countByOrder.get(order.id) ?? 0,
  }));
}

export async function getAdminOrder(id: string): Promise<AdminOrderWithItems | null> {
  if (!isDatabaseConfigured()) return null;
  const [order] = await getDb()
    .select()
    .from(orders)
    .where(eq(orders.id, id))
    .limit(1);
  if (!order) return null;
  const items = await getDb()
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, order.id))
    .orderBy(orderItems.title);
  return { ...order, items };
}

export async function updateOrderPaymentStatus(
  orderId: string,
  status: Extract<OrderRow["status"], "paid" | "failed" | "refunded">,
): Promise<boolean> {
  if (!isDatabaseConfigured()) return false;
  const [updated] = await getDb()
    .update(orders)
    .set({
      status,
      paidAt: status === "paid" ? new Date() : null,
    })
    .where(eq(orders.id, orderId))
    .returning({ id: orders.id });
  return !!updated;
}

export async function updateOrderShipping({
  orderId,
  shippingStatus,
  trackingNumber,
  trackingCarrier,
}: {
  orderId: string;
  shippingStatus: OrderRow["shippingStatus"];
  trackingNumber?: string;
  trackingCarrier?: string;
}): Promise<boolean> {
  if (!isDatabaseConfigured()) return false;
  const updates: Partial<OrderRow> = {
    shippingStatus,
  };
  if (trackingNumber) updates.trackingNumber = trackingNumber;
  if (trackingCarrier) updates.trackingCarrier = trackingCarrier;
  if (shippingStatus === "shipped" || shippingStatus === "delivered") {
    if (shippingStatus === "shipped" || trackingNumber) {
      updates.shippedAt = new Date();
    }
    if (shippingStatus === "delivered") updates.deliveredAt = new Date();
  }
  const [updated] = await getDb()
    .update(orders)
    .set(updates as Partial<OrderRow>)
    .where(eq(orders.id, orderId))
    .returning({ id: orders.id });
  return !!updated;
}

export function shippingStatusLabel(
  status: OrderRow["shippingStatus"],
): string {
  switch (status) {
    case "awaiting_shipment":
      return "Awaiting shipment";
    case "shipped":
      return "Shipped";
    case "delivered":
      return "Delivered";
    case "returned":
      return "Returned";
    default:
      return status;
  }
}