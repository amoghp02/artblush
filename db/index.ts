import "server-only";

import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

function createDb() {
  return drizzle({
    connection: process.env.DATABASE_URL!,
    schema,
  });
}

/** True when a DATABASE_URL is present — guards build-time fallbacks. */
export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

// Singleton per serverless instance; constructed lazily.
declare global {
  var __artblushDb: ReturnType<typeof createDb> | undefined;
}

export function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is not set — queries against the database require a Neon connection string.",
    );
  }
  if (!globalThis.__artblushDb) {
    globalThis.__artblushDb = createDb();
  }
  return globalThis.__artblushDb;
}