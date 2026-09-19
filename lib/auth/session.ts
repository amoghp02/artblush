import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import { getDb, isDatabaseConfigured } from "@/db";
import { sessions, users } from "@/db/schema";
import type { UserRow } from "@/db/schema";

export const SESSION_COOKIE = "artblush_session";
export const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
}

export async function createSession(userId: string): Promise<void> {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  if (isDatabaseConfigured()) {
    await getDb().insert(sessions).values({ id: token, userId, expiresAt });
  }

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;

  if (token && isDatabaseConfigured()) {
    try {
      await getDb().delete(sessions).where(eq(sessions.id, token));
    } catch {
      // Cookie is cleared regardless of DB state.
    }
  }

  store.delete(SESSION_COOKIE);
}

export async function getCurrentUser(): Promise<PublicUser | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  if (!isDatabaseConfigured()) return null;

  const [row] = await getDb()
    .select({
      user: users,
      expiresAt: sessions.expiresAt,
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(eq(sessions.id, token))
    .limit(1);

  if (!row) return null;

  if (row.expiresAt.getTime() < Date.now()) {
    await getDb().delete(sessions).where(eq(sessions.id, token));
    return null;
  }

  return publicUser(row.user);
}

export function publicUser(user: UserRow): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
  };
}

/** Redirects to /login (optionally back to `next`) when there is no session. */
export async function requireUser(next?: string): Promise<PublicUser> {
  const user = await getCurrentUser();
  if (!user) {
    const target = next ? `?next=${encodeURIComponent(next)}` : "";
    redirect(`/login${target}`);
  }
  return user;
}