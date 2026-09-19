"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb, isDatabaseConfigured } from "@/db";
import { users } from "@/db/schema";
import { hashPassword, verifyPassword } from "./password";
import { createSession, destroySession, getCurrentUser } from "./session";

export interface AuthFormState {
  error: string | null;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function safeNext(value: string | null): string {
  if (!value) return "/account";
  if (!value.startsWith("/") || value.startsWith("//")) return "/account";
  return value;
}

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export async function signUp(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = normalizeEmail(String(formData.get("email") ?? ""));
  const phone = String(formData.get("phone") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = safeNext(String(formData.get("next") ?? ""));

  if (name.length < 2) {
    return { error: "Please enter your name." };
  }
  if (!EMAIL_RE.test(email)) {
    return { error: "Please enter a valid email address." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters long." };
  }
  if (!isDatabaseConfigured()) {
    return { error: "Accounts are not available yet. Please try again later." };
  }

  const [existing] = await getDb()
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing) {
    return { error: "An account with this email already exists. Please log in." };
  }

  const passwordHash = await hashPassword(password);
  const [created] = await getDb()
    .insert(users)
    .values({
      name,
      email,
      phone: phone || null,
      passwordHash,
    })
    .returning({ id: users.id });

  await createSession(created.id);
  redirect(next);
}

export async function login(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = normalizeEmail(String(formData.get("email") ?? ""));
  const password = String(formData.get("password") ?? "");
  const next = safeNext(String(formData.get("next") ?? ""));

  if (!EMAIL_RE.test(email) || !password) {
    return { error: "Please enter your email and password." };
  }
  if (!isDatabaseConfigured()) {
    return { error: "Accounts are not available yet. Please try again later." };
  }

  const [user] = await getDb()
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  const passwordOk = user
    ? await verifyPassword(password, user.passwordHash)
    : false;

  if (!user || !passwordOk) {
    return { error: "Incorrect email or password." };
  }

  await createSession(user.id);
  redirect(next);
}

export async function logout() {
  await destroySession();
  redirect("/");
}

export async function updateProfile(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Please sign in to update your profile." };
  }

  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();

  if (name.length < 2) {
    return { error: "Please enter your name." };
  }
  if (!isDatabaseConfigured()) {
    return { error: "Accounts are not available yet. Please try again later." };
  }

  await getDb()
    .update(users)
    .set({ name, phone: phone || null, updatedAt: new Date() })
    .where(eq(users.id, user.id));

  redirect("/account/profile");
}