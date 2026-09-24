import "server-only";

import { desc, eq } from "drizzle-orm";
import { getDb, isDatabaseConfigured } from "@/db";
import { commissions } from "@/db/schema";
import type { CommissionRow } from "@/db/schema";

export async function getCommissions(): Promise<CommissionRow[]> {
  if (!isDatabaseConfigured()) return [];
  return getDb()
    .select()
    .from(commissions)
    .orderBy(desc(commissions.createdAt));
}

export async function updateCommissionStatus({
  id,
  status,
  note,
}: {
  id: string;
  status: CommissionRow["status"];
  note?: string;
}): Promise<boolean> {
  if (!isDatabaseConfigured()) return false;
  const [updated] = await getDb()
    .update(commissions)
    .set({ status, note: note ?? null, updatedAt: new Date() })
    .where(eq(commissions.id, id))
    .returning({ id: commissions.id });
  return !!updated;
}