import { drizzle } from "drizzle-orm/neon-http";
import { artworks as staticArtworks } from "@/lib/artworks";
import { artworks } from "./schema";

const connection = process.env.DATABASE_URL;
if (!connection) {
  console.error("DATABASE_URL is required to seed.");
  process.exit(1);
}

const db = drizzle({ connection, schema: { artworks } });

// Placeholder-priced artworks. Prices are in PAISE (Razorpay convention).
// Only artworks marked saleable appear in the buy-now flow. Tune these
// before going live — they are stand-ins, not studio pricing.
const placeholderPricing: Record<string, { price: number; saleable: boolean }> = {
  "quiet-gaze": { price: 450000, saleable: true },        // ₹4,500
  "the-old-soul": { price: 550000, saleable: true },      // ₹5,500
  "untitled-study": { price: 350000, saleable: true },    // ₹3,500
  "monochrome-memory": { price: 400000, saleable: true }, // ₹4,000
  "portrait-in-silence": { price: 600000, saleable: true }, // ₹6,000
  "study-in-charcoal": { price: 650000, saleable: true }, // ₹6,500
  "between-light-and-dark": { price: 450000, saleable: true }, // ₹4,500
  "between-moments": { price: 550000, saleable: false },  // commissioned
  "her-portrait": { price: 700000, saleable: true },      // ₹7,000
  "eyes-that-remember": { price: 650000, saleable: false }, // commissioned
  "stillness": { price: 300000, saleable: false },        // private collection
  "borrowed-time": { price: 600000, saleable: false },    // commissioned
};

async function main() {
  const rows = staticArtworks.map((art) => {
    const pricing = placeholderPricing[art.id] ?? { price: 0, saleable: false };
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