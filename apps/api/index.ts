import dotenv from "dotenv";
dotenv.config({});

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import adminRoutes from "./route/admin.routes";
import authRoutes from "./route/auth.routes";
import emailRoutes from "./route/email.routes";
import { checkDbConnection } from "@portfolio/shared";
import { PRODUCTION } from "./utils/config";

// Validate required environment variables at startup
const REQUIRED_ENV_VARS = ["JWT_KEY", "EMAIL", "EMAIL_PASS"];
const missingEnvVars = REQUIRED_ENV_VARS.filter(key => {
    const val = process.env[key];
    return !val || val.trim() === "";
});

if (missingEnvVars.length > 0) {
    console.warn(`[Startup Warning] Missing or empty environment variables: ${missingEnvVars.join(", ")}`);
}

const app = express();
app.use(express.json());
app.use(cookieParser());

// Robust CORS setup
app.use(cors({
    origin: (origin, callback) => {
        const cleanOrigin = origin?.trim();
        const liveClientUrl = "https://my-portfolio-client-lemon.vercel.app";

        if (!cleanOrigin || process.env.NODE_ENV !== "production" || cleanOrigin === liveClientUrl) {
            callback(null, true);
        } else {
            callback(new Error(`Not allowed by CORS: Origin '${cleanOrigin}' is not permitted in production.`));
        }
    },
    credentials: true
}));

app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/email", emailRoutes);

// General status route
app.get("/", (req, res) => {
    res.json({
        status: "success",
        message: "MyAppPortfolio API Server is active",
        environment: process.env.VERCEL ? "Vercel Serverless" : "Local",
        configuration: {
            databaseUrl: (process.env.MONGO_URL || process.env.DATABASE_URL) ? "Configured" : "Missing",
            jwtKey: process.env.JWT_KEY ? "Configured" : "Missing",
            cloudinaryKey: process.env.CLOUDINARY_API_KEY ? "Configured" : "Missing",
            email: process.env.EMAIL ? "Configured" : "Missing",
        }
    });
});

// Production-ready health check endpoint checking DB connectivity
app.get("/api/health", async (req: Request, res: Response) => {
    const dbStatus = await checkDbConnection();
    res.status(dbStatus.success ? 200 : 500).json({
        status: dbStatus.success ? "healthy" : "unhealthy",
        timestamp: new Date().toISOString(),
        database: {
            connected: dbStatus.success,
            error: dbStatus.error || null
        },
        environment: process.env.VERCEL ? "Vercel Serverless" : "Local"
    });
});

// Global Error Handler Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(`[Express Global Error Handler] Path: ${req.path} | Error:`, err);

    const isCorsError = err.message && err.message.startsWith("Not allowed by CORS");
    const statusCode = isCorsError ? 403 : (err.statusCode || err.status || 500);

    res.status(statusCode).json({
        status: "error",
        message: err.message || "An unexpected internal server error occurred.",
        error: process.env.NODE_ENV !== "production" ? err.stack : undefined
    });
});

if (!process.env.VERCEL) {
    app.listen(process.env.PORT || 5000, () => {
        console.log("Server is Running locally");
        console.log("mode", `${process.env.NODE_ENV}`);
        console.log("Port", `${process.env.PORT || 5000}`);
    });
}

export default app;
