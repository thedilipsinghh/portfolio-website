import { db, projects } from "@portfolio/shared";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../.env") });

const projectSeed = async () => {
    try {
        console.log("Seeding Projects...");
        const ProjectResult = await db.select().from(projects).limit(1);
        if (ProjectResult.length > 0) {
            console.log("ProjectResult Already Exist");
            process.exit();
        }
        await db.insert(projects).values({
            title: "PORTFOLIO WEB APP",
            description: "Real-time chat application built with React and Socket.IO with user authentication and message storage.",
            note: "Note: Hosted on Render (free tier). Initial load may take a few seconds due to server cold start.",
            image: "/project2.jpg",
            tags: "Node.js",
            liveLink: "#",
            githubLink: "#",
        });
        console.log("Project Seed done");
        process.exit();
    } catch (error) {
        console.log(error);
        process.exit();
    }
};
projectSeed();
