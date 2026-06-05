import { db, admins } from "@portfolio/shared";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../.env") });

const adminSeed = async () => {
    try {
        console.log("Seeding Admin...");
        const adminResult = await db.select().from(admins).limit(1);
        if (adminResult.length > 0) {
            console.log("admin data Already Exist");
            process.exit();
        }
        const hash = await bcrypt.hash(process.env.seedPassword as string, 10);
        await db.insert(admins).values({
            name: "Dilip Singh",
            email: process.env.seedEmail as string,
            password: hash,
            mobile: 997513449,
            role: "admin"
        });
        console.log("Admin Seed Success");
        process.exit();
    } catch (error) {
        console.log(error);
        process.exit();
    }
};
adminSeed();
