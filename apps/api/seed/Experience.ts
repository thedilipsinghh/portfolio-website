import { db, experiences } from "@portfolio/shared";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../.env") });

const ExperinceSeed = async () => {
    try {
        console.log("Seeding Experience...");
        const ExpResult = await db.select().from(experiences).limit(1);
        if (ExpResult.length > 0) {
            console.log("ExpResult Data Already Exist ");
            process.exit();
        }
        await db.insert(experiences).values({
            title: "Frontend Developer Intern",
            place: "SkillHub IT Solution",
            date: "Feb 2026 — Present",
            type: "work",
            description:
                "Currently working on real-world frontend applications, improving UI performance, building responsive interfaces, and collaborating with developers."
        });
        console.log("expResult Seed done");
        process.exit();
    } catch (error) {
        console.log(error);
        process.exit();
    }
};

ExperinceSeed();
