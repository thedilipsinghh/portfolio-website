import dotenv from "dotenv";
dotenv.config({});

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

import { FRONTEND_URL } from "./utils/config";
import adminRoutes from "./route/admin.routes";
import authRoutes from "./route/auth.routes";
import emailRoutes from "./route/email.routes";

mongoose.connect(process.env.MONGO_URL as string);

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: process.env.NODE_ENV === "production"
        ? [
            "https://portfolio-website-web-five.vercel.app"
        ]
        : "http://localhost:3000",
    credentials: true
}));

app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/email", emailRoutes);

mongoose.connection.once("open", () => {
    console.log("db connected");
});

if (!process.env.VERCEL) {
    app.listen(process.env.PORT || 5000, () => {
        console.log("Server is Running");
        console.log("mode", `${process.env.NODE_ENV}`);
        console.log("Port", `${process.env.PORT || 5000}`);
    });
}

export default app;
