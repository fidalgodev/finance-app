import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// Load environment variables from .env file since we are outside of the Next.js environment
config({ path: ".env.local" });

export default defineConfig({
  dialect: "postgresql",
  schema: "./db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
