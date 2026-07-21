import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "postgresql://neondb_owner:npg_ztMXZ7SYEHq9@ep-calm-thunder-a268jk9x-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
  },
});