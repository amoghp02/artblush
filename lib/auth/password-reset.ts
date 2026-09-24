import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import { getDb, isDatabaseConfigured } from "@/db";
import { passwordResets, users } from "@/db/schema";
import type { PasswordResetRow, UserRow } from "@/db/schema";

export const PASSWORD_RESET_TTL_MS = 30 * 60 * 1000;

/** One-way hash so a leaked token_hash column is useless to an attacker. */
export function hashResetToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function issueResetToken(): string {
  return randomBytes(32).toString("hex");
}

export async function createPasswordResetRecord(
  userId: string,
  tokenHash: string,
  ttlMs: number = PASSWORD_RESET_TTL_MS,
): Promise<boolean> {
  if (!isDatabaseConfigured()) return false;
  await getDb()
    .insert(passwordResets)
    .values({
      userId,
      tokenHash,
      expiresAt: new Date(Date.now() + ttlMs),
    });
  return true;
}

export interface PasswordResetPayload {
  reset: PasswordResetRow;
  user: UserRow;
}

/** Returns the reset + user when the token is valid, unused and unexpired. */
export async function findPasswordReset(
  token: string,
): Promise<PasswordResetPayload | null> {
  if (!token) return null;
  if (!isDatabaseConfigured()) return null;
  const tokenHash = hashResetToken(token);

  const [row] = await getDb()
    .select({ reset: passwordResets, user: users })
    .from(passwordResets)
    .innerJoin(users, eq(passwordResets.userId, users.id))
    .where(eq(passwordResets.tokenHash, tokenHash))
    .limit(1);

  if (!row) return null;
  if (row.reset.usedAt) return null;
  if (row.reset.expiresAt.getTime() < Date.now()) return null;
  return row;
}

export async function markPasswordResetUsed(tokenHash: string): Promise<void> {
  await getDb()
    .update(passwordResets)
    .set({ usedAt: new Date() })
    .where(eq(passwordResets.tokenHash, tokenHash));
}