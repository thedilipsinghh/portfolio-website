import { Request, Response } from "express";
import { db, admins } from "@portfolio/shared";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const loginAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const results = await db.select().from(admins).where(eq(admins.email, email)).limit(1);
        const User = results[0];

        if (!User) {
            res.status(200).json({ message: "Invalid email or Password" });
            console.log("Invalid email or Password");
            return;
        }

        const verify = await bcrypt.compare(password, User.password as string);
        if (!verify) {
            console.log("invalid Email or Password");
            res.status(200).json({ message: "Invalid email or Password" });
            return;
        }

        const token = jwt.sign(
            { id: User.id },
            process.env.JWT_KEY as string,
            { expiresIn: "1d" }
        );
        res.cookie("PortfolioAdmin", token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24,
            secure: process.env.NODE_ENV === "production"
        });
        res.status(200).json({ message: "Admin login Success", token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Unable to login admin" });
    }
};

export const AdminLogout = async (req: Request, res: Response): Promise<void> => {
    try {
        res.clearCookie("PortfolioAdmin");
        res.status(200).json({ message: "Logout success" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Unable to logout " });
    }
};
