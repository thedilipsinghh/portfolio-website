import { db, skills } from "@portfolio/shared";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../.env") });

const skillSeed = async () => {
    try {
        console.log("Seeding Skills...");
        const skillResult = await db.select().from(skills).limit(1);
        if (skillResult.length > 0) {
            console.log("skillResult already Exist ");
            process.exit();
        }
        await db.insert(skills).values({
            name: "React",
        });
        console.log("skill Seed done ");
        process.exit();
    } catch (error) {
        console.log(error);
        process.exit();
    }
};
skillSeed();
