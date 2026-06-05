import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({
    path: path.join(__dirname, "../../apps/api/.env")
});

export default defineConfig({
    dialect: "postgresql",
    schema: "./src/db/schema.ts",
    out: "./drizzle",
    dbCredentials: {
        url: (process.env.MONGO_URL || process.env.DATABASE_URL) as string
    }
});
