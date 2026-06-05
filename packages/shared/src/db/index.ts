import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import dotenv from "dotenv";
import path from "path";

// Load environment variables automatically for workspace scripts and tests
dotenv.config({ path: path.join(__dirname, "../../../../apps/api/.env") });
dotenv.config();

const databaseUrl = process.env.MONGO_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
    throw new Error("MONGO_URL or DATABASE_URL environment variable is required");
}

const sql = neon(databaseUrl);
export const db = drizzle(sql, { schema });
export * from "./schema";
