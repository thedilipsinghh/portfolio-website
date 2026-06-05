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

app.listen(process.env.PORT, () => {
    console.log("Server is Running");
    console.log("mode", `${process.env.NODE_ENV}`);
    console.log("Port", `${process.env.PORT}`);
});
