import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

let cached: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  if (cached) return cached;

  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not configured");
  }

  const client = postgres(url, {
    max: process.env.NODE_ENV === "production" ? 10 : 5,
    prepare: false,
  });

  cached = drizzle(client, { schema });
  return cached;
}
