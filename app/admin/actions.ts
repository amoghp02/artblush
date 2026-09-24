"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { destroySession, requireAdmin } from "@/lib/auth/session";
import { getDb } from "@/db";
import { sessions } from "@/db/schema";
import { revalidateStorefrontForArtworks } from "@/lib/revalidate-site";
import { sendShipmentNotification } from "@/lib/email";
import {
  getAdminOrder,
  updateOrderPaymentStatus,
  updateOrderShipping,
} from "@/lib/admin/orders";
import { updateArtwork } from "@/lib/admin/artworks";
import { updateCommissionStatus } from "@/lib/admin/commissions";

async function guard() {
  await requireAdmin();
}

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

export async function updateOrderStatusAction(formData: FormData) {
  await guard();
  const orderId = str(formData, "orderId");
  const status = str(formData, "status");
  if (!orderId || !["paid", "failed", "refunded"].includes(status)) return;
  await updateOrderPaymentStatus(
    orderId,
    status as "paid" | "failed" | "refunded",
  );
  revalidatePath("/admin/orders");
  redirect(`/admin/orders/${orderId}`);
}

export async function updateShippingAction(formData: FormData) {
  await guard();
  const orderId = str(formData, "orderId");
  const shippingStatus = str(formData, "shippingStatus");
  const trackingNumber = str(formData, "trackingNumber") || undefined;
  const trackingCarrier = str(formData, "trackingCarrier") || undefined;
  if (
    !orderId ||
    !["awaiting_shipment", "shipped", "delivered", "returned"].includes(
      shippingStatus,
    )
  ) {
    return;
  }

  const before = await getAdminOrder(orderId);
  const ok = await updateOrderShipping({
    orderId,
    shippingStatus: shippingStatus as "awaiting_shipment" | "shipped" | "delivered" | "returned",
    trackingNumber,
    trackingCarrier,
  });

  if (
    ok &&
    shippingStatus === "shipped" &&
    before &&
    before.shippingStatus !== "shipped"
  ) {
    await sendShipmentNotification({
      to: before.customerEmail,
      customerName: before.customerName,
      orderReference: orderId.slice(0, 8).toUpperCase(),
      trackingNumber,
      trackingCarrier,
    });
  }

  revalidatePath("/admin/orders");
  redirect(`/admin/orders/${orderId}`);
}

export async function updateArtworkAction(formData: FormData) {
  await guard();
  const id = str(formData, "id");
  const priceRupeesRaw = str(formData, "priceRupees");
  const saleable = formData.get("saleable") === "on";
  const status = str(formData, "status");
  if (!id || !["Available", "Commissioned", "Private Collection"].includes(status)) {
    return;
  }
  const priceRupees =
    priceRupeesRaw === "" || Number.isNaN(Number(priceRupeesRaw))
      ? null
      : Number(priceRupeesRaw);
  const pricePaise = priceRupees === null ? null : Math.round(priceRupees * 100);
  await updateArtwork({ id, pricePaise, saleable, status: status as "Available" | "Commissioned" | "Private Collection" });
  revalidateStorefrontForArtworks([id]);
  revalidatePath("/admin/artworks");
  redirect("/admin/artworks");
}

export async function updateCommissionAction(formData: FormData) {
  await guard();
  const id = str(formData, "id");
  const status = str(formData, "status");
  const note = str(formData, "note") || undefined;
  if (!id || !["new", "contacted", "in_progress", "completed", "declined"].includes(status)) {
    return;
  }
  await updateCommissionStatus({
    id,
    status: status as "new" | "contacted" | "in_progress" | "completed" | "declined",
    note,
  });
  revalidatePath("/admin/commissions");
  redirect("/admin/commissions");
}

export async function adminLogoutAction() {
  await destroySession();
  redirect("/login");
}

export async function revokeAdminSessionAction(formData: FormData) {
  await guard();
  const id = str(formData, "id");
  if (!id) return;

  await getDb().delete(sessions).where(eq(sessions.id, id));
  revalidatePath("/admin");
  redirect("/admin");
}