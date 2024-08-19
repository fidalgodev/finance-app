import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { config } from "dotenv";

// Load environment variables from .env file
config({ path: ".env.local" });

export const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql);
