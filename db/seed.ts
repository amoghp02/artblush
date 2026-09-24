import { drizzle } from "drizzle-orm/neon-http";
import { artworks as staticArtworks } from "@/lib/artworks";
import { artworks } from "./schema";

const connection = process.env.DATABASE_URL;
if (!connection) {
  console.error("DATABASE_URL is required to seed.");
  process.exit(1);
}

const db = drizzle({ connection, schema: { artworks } });

// Prices live on the Artwork objects in `lib/artworks.ts` (PAISE, Razorpay
// convention). Placeholder studio pricing — tune before going live.
async function main() {
  const rows = staticArtworks.map((art) => {
    const pricing = art.saleable && art.price != null
      ? { price: art.price, saleable: true }
      : { price: 0, saleable: false };
    return {
      id: art.id,
      title: art.title,
      categories: art.categories,
      medium: art.medium,
      year: art.year,
      dimensions: art.dimensions,
      image: art.image,
      imageAlt: art.imageAlt,
      description: art.description,
      story: art.story,
      status: art.status,
      featured: art.featured ?? false,
      price: pricing.price,
      currency: "INR",
      saleable: pricing.saleable,
      sold: art.sold ?? false,
    };
  });

  await db.insert(artworks).values(rows).onConflictDoNothing();
  console.log(`Seeded ${rows.length} artworks.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});