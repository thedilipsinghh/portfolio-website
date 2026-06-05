import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import dotenv from "dotenv";
import path from "path";

// Load environment variables automatically for workspace scripts and tests
dotenv.config({ path: path.join(__dirname, "../../../../apps/api/.env") });
dotenv.config();

const databaseUrl = (process.env.MONGO_URL || process.env.DATABASE_URL)?.trim();

const getDb = () => {
    if (!databaseUrl) {
        console.warn("WARNING: MONGO_URL or DATABASE_URL is missing! Database queries will fail.");
        return null;
    }
    try {
        const sql = neon(databaseUrl);
        return drizzle(sql, { schema });
    } catch (e) {
        console.error("CRITICAL: Failed to initialize Drizzle database client:", e);
        return null;
    }
};

export const db = getDb() as unknown as ReturnType<typeof drizzle<typeof schema>>;
export * from "./schema";
