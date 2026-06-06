import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import dotenv from "dotenv";

// Safe environment variable loading for workspace scripts and tests
try {
    if (typeof process !== "undefined" && process.env && typeof require === "function") {
        const fs = require("fs");
        const path = require("path");
        const apiEnvPath = path.join(__dirname, "../../../../apps/api/.env");
        if (fs.existsSync(apiEnvPath)) {
            dotenv.config({ path: apiEnvPath });
        }
    }
} catch (e) {
    // Ignore error if fs/path is not available (e.g. edge or client bundle environments)
}

try {
    dotenv.config();
} catch (e) {
    // Ignore
}

// Custom fetch implementation with built-in retry logic for Neon HTTP queries
const customFetchWithRetry = async (input: any, init?: any): Promise<any> => {
    let retries = 3;
    let delay = 500; // start with 500ms backoff
    while (retries > 0) {
        try {
            const response = await fetch(input, init);
            // Retry on server-side errors (5xx)
            if (response.status >= 500 && retries > 1) {
                console.warn(`Database connection returned status ${response.status}. Retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                retries--;
                delay *= 2;
                continue;
            }
            return response;
        } catch (error) {
            if (retries <= 1) {
                throw error;
            }
            console.warn(`Database connection failed. Retrying in ${delay}ms... Error:`, error);
            await new Promise(resolve => setTimeout(resolve, delay));
            retries--;
            delay *= 2;
        }
    }
    throw new Error("Database query failed after all retries.");
};

// Override the global fetch function for Neon queries
neonConfig.fetchFunction = customFetchWithRetry;

// Lazy-loaded database client
let lazyDb: any = null;

const getRealDb = () => {
    if (lazyDb) return lazyDb;

    const rawUrl = process.env.MONGO_URL || process.env.DATABASE_URL;
    if (!rawUrl) {
        throw new Error("Database URL is missing. Ensure MONGO_URL or DATABASE_URL is configured.");
    }
    const trimmed = rawUrl.trim();
    if (trimmed === "") {
        throw new Error("Database URL is empty.");
    }

    if (!trimmed.startsWith("postgres://") && !trimmed.startsWith("postgresql://")) {
        throw new Error("Invalid database URL format. Connection string must start with 'postgres://' or 'postgresql://'.");
    }

    try {
        const sql = neon(trimmed);
        lazyDb = drizzle(sql, { schema });
        return lazyDb;
    } catch (e: any) {
        throw new Error(`Failed to initialize Drizzle database client: ${e.message}`);
    }
};

// Safe Proxy wrapping the database client
export const db = new Proxy({}, {
    get(target: any, prop: string | symbol) {
        // Safe check for common node/bundler properties to prevent startup crashes
        if (prop === "then" || prop === "toJSON" || prop === "constructor" || typeof prop === "symbol") {
            return undefined;
        }
        const realDb = getRealDb();
        return Reflect.get(realDb, prop);
    }
}) as unknown as ReturnType<typeof drizzle<typeof schema>>;

// Database connection health check utility
export const checkDbConnection = async (): Promise<{ success: boolean; error?: string }> => {
    const rawUrl = process.env.MONGO_URL || process.env.DATABASE_URL;
    if (!rawUrl) {
        return { success: false, error: "Database URL is missing." };
    }
    try {
        const sql = neon(rawUrl.trim());
        await sql`SELECT 1 as one;`;
        return { success: true };
    } catch (err: any) {
        return { success: false, error: err.message || "Failed to connect to database." };
    }
};

export * from "./schema";
