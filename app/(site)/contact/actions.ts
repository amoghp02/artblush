"use server";

import { getDb, isDatabaseConfigured } from "@/db";
import { commissions } from "@/db/schema";
import { notifyStudioOfCommission } from "@/lib/email";

export interface CommissionFormState {
  ok: boolean;
  error: string | null;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitCommission(
  _prev: CommissionFormState,
  formData: FormData,
): Promise<CommissionFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const phone = String(formData.get("phone") ?? "").trim();
  const enquiryType = String(formData.get("enquiryType") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (name.length < 2) {
    return { ok: false, error: "Please enter your name." };
  }
  if (!EMAIL_RE.test(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }
  if (!enquiryType) {
    return { ok: false, error: "Please choose what you’re looking for." };
  }
  if (message.length < 10) {
    return {
      ok: false,
      error: "Please tell us a little more about your idea (at least 10 characters).",
    };
  }
  if (!isDatabaseConfigured()) {
    return {
      ok: false,
      error: "Enquiries aren’t available yet. Please email the studio directly.",
    };
  }

  await getDb().insert(commissions).values({
    name,
    email,
    phone: phone || null,
    enquiryType,
    message,
  });

  await notifyStudioOfCommission({ name, email, phone: phone || undefined, enquiryType, message });

  return { ok: true, error: null };
}