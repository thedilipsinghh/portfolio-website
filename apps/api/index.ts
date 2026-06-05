import dotenv from "dotenv";
dotenv.config({});

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import adminRoutes from "./route/admin.routes";
import authRoutes from "./route/auth.routes";
import emailRoutes from "./route/email.routes";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || process.env.NODE_ENV !== "production" || origin === "https://my-portfolio-client-lemon.vercel.app") {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));

app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/email", emailRoutes);

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

if (!process.env.VERCEL) {
    app.listen(process.env.PORT || 5000, () => {
        console.log("Server is Running locally");
        console.log("mode", `${process.env.NODE_ENV}`);
        console.log("Port", `${process.env.PORT || 5000}`);
    });
}

export default app;
