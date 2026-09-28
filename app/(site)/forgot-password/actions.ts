"use server";

import { eq } from "drizzle-orm";
import { getDb, isDatabaseConfigured } from "@/db";
import { users } from "@/db/schema";
import { sendPasswordResetEmail } from "@/lib/email";
import { getSiteUrl } from "@/lib/auth/site-url";
import {
  createPasswordResetRecord,
  hashResetToken,
  issueResetToken,
} from "@/lib/auth/password-reset";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface ForgotPasswordState {
  error: string | null;
  done: boolean;
}

export async function requestPasswordReset(
  _prev: ForgotPasswordState,
  formData: FormData,
): Promise<ForgotPasswordState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!EMAIL_RE.test(email)) {
    return { error: "Please enter a valid email address.", done: false };
  }
  if (!isDatabaseConfigured()) {
    return { error: "Accounts are not available yet. Please try again later.", done: false };
  }

  const [user] = await getDb()
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  // Always report success — never reveal whether an email is registered.
  if (user) {
    const token = issueResetToken();
    const stored = await createPasswordResetRecord(user.id, hashResetToken(token));
    if (stored) {
      const resetUrl = `${getSiteUrl()}/reset-password?token=${encodeURIComponent(token)}`;
      await sendPasswordResetEmail({ to: user.email, name: user.name, resetUrl });
    }
  }

  return { error: null, done: true };
}