"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb, isDatabaseConfigured } from "@/db";
import { sessions, users } from "@/db/schema";
import { hashPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import {
  findPasswordReset,
  hashResetToken,
  markPasswordResetUsed,
} from "@/lib/auth/password-reset";

export interface ResetPasswordState {
  error: string | null;
}

export async function resetPassword(
  _prev: ResetPasswordState,
  formData: FormData,
): Promise<ResetPasswordState> {
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters long." };
  }
  if (password !== confirm) {
    return { error: "Passwords do not match." };
  }
  if (!isDatabaseConfigured()) {
    return { error: "Reset is not available right now. Please try again later." };
  }

  const reset = await findPasswordReset(token);
  if (!reset) {
    return {
      error: "This reset link is invalid or has expired. Please request a new one.",
    };
  }

  const passwordHash = await hashPassword(password);
  await getDb()
    .update(users)
    .set({ passwordHash, updatedAt: new Date() })
    .where(eq(users.id, reset.user.id));

  await markPasswordResetUsed(hashResetToken(token));

  // Revoke every existing session so only the fresh sign-in survives.
  await getDb().delete(sessions).where(eq(sessions.userId, reset.user.id));

  if (reset.user.role === "admin") {
    redirect("https://admin.artblush.in/login");
  }

  await createSession(reset.user.id);
  redirect("/account");
}