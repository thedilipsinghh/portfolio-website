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

// Safe environment variable validation and retrieval
const getDatabaseUrl = (): string | undefined => {
    const rawUrl = process.env.MONGO_URL || process.env.DATABASE_URL;
    if (!rawUrl) return undefined;
    const trimmed = rawUrl.trim();
    return trimmed === "" ? undefined : trimmed;
};

const databaseUrl = getDatabaseUrl();

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

// Create a fail-safe database client proxy that throws descriptive errors instead of TypeError
const createDbProxy = (errorMessage: string): any => {
    const handler = {
        get(target: any, prop: string | symbol) {
            // Return a function that throws the descriptive error when invoked
            return () => {
                throw new Error(`Database Client Query Error: ${errorMessage}`);
            };
        }
    };
    return new Proxy({}, handler);
};

const getDb = () => {
    if (!databaseUrl) {
        console.warn("WARNING: MONGO_URL or DATABASE_URL environment variable is missing! Database queries will fail.");
        return createDbProxy("Database URL is missing. Ensure MONGO_URL or DATABASE_URL is configured in your environment variables.");
    }

    if (!databaseUrl.startsWith("postgres://") && !databaseUrl.startsWith("postgresql://")) {
        console.error("CRITICAL: Database URL must start with 'postgres://' or 'postgresql://'.");
        return createDbProxy("Invalid database URL format. Connection string must start with 'postgres://' or 'postgresql://'.");
    }

    try {
        const sql = neon(databaseUrl);
        return drizzle(sql, { schema });
    } catch (e: any) {
        console.error("CRITICAL: Failed to initialize Drizzle database client:", e);
        return createDbProxy(`Failed to initialize Drizzle database client: ${e.message}`);
    }
};

// Database connection health check utility
export const checkDbConnection = async (): Promise<{ success: boolean; error?: string }> => {
    if (!databaseUrl) {
        return { success: false, error: "Database URL is missing." };
    }
    try {
        const sql = neon(databaseUrl);
        await sql`SELECT 1 as one;`;
        return { success: true };
    } catch (err: any) {
        return { success: false, error: err.message || "Failed to connect to database." };
    }
};

export const db = getDb() as unknown as ReturnType<typeof drizzle<typeof schema>>;
export * from "./schema";
