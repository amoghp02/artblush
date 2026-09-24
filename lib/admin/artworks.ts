import "server-only";

import { asc, eq } from "drizzle-orm";
import { getDb, isDatabaseConfigured } from "@/db";
import { artworks } from "@/db/schema";
import type { ArtworkRow } from "@/db/schema";

export async function getAdminArtworks(): Promise<ArtworkRow[]> {
  if (!isDatabaseConfigured()) return [];
  return getDb().select().from(artworks).orderBy(asc(artworks.createdAt));
}

export interface UpdateArtworkInput {
  id: string;
  pricePaise: number | null;
  saleable: boolean;
  status: ArtworkRow["status"];
}

/**
 * Updates a piece's shop details. Relisting logic: choosing status
 * "Available" releases the piece (sold=false) so it can be bought again;
 * any other status makes it unsaleable.
 */
export async function updateArtwork(input: UpdateArtworkInput): Promise<boolean> {
  if (!isDatabaseConfigured()) return false;
  const available = input.status === "Available";
  const [updated] = await getDb()
    .update(artworks)
    .set({
      price: input.pricePaise,
      saleable: input.saleable && available,
      status: input.status,
      sold: !available,
      updatedAt: new Date(),
    })
    .where(eq(artworks.id, input.id))
    .returning({ id: artworks.id });
  return !!updated;
}