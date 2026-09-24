import { and, desc, eq, gt } from "drizzle-orm";
import { getDb } from "@/db";
import { sessions, users } from "@/db/schema";

export interface ActiveAdminSession {
  sessionId: string;
  email: string;
  name: string;
  createdAt: Date;
  expiresAt: Date;
}

/** Currently open (non-expired) admin sessions — i.e. "who is signed in right now". */
export async function listActiveAdminSessions(): Promise<ActiveAdminSession[]> {
  return getDb()
    .select({
      sessionId: sessions.id,
      email: users.email,
      name: users.name,
      createdAt: sessions.createdAt,
      expiresAt: sessions.expiresAt,
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(and(eq(users.role, "admin"), gt(sessions.expiresAt, new Date())))
    .orderBy(desc(sessions.createdAt))
    .limit(50);
}

export async function countActiveAdminSessions(): Promise<number> {
  const rows = await getDb()
    .select({ id: sessions.id })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(and(eq(users.role, "admin"), gt(sessions.expiresAt, new Date())));
  return rows.length;
}