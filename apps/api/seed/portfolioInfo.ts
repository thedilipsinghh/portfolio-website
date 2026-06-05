import { db, portfolios } from "@portfolio/shared";
import path from "path";
import dotenv from "dotenv";

dotenv.config({
    path: path.join(__dirname, "../.env")
});

const portfolioInfo = async () => {
    try {
        console.log("Seeding Portfolio...");
        const result = await db.select().from(portfolios).limit(1);

        if (result.length > 0) {
            console.log("Portfolio already exists");
            process.exit();
        }

        await db.insert(portfolios).values({
            heroName: "Dilip Singh",
            heroTitle: "MERN Stack Developer",
            heroProfileImage: "/profile.jpg",
            heroResume: "/profile.jpg",
            aboutDescription1: "I build modern web apps",
            aboutDescription2: "Currently working as frontend developer",
            statsYearsExperience: 1,
            statsProjectsCompleted: 7,
            statsTechnologies: 15,
            statsHappyClients: 2,
            contactEmail: "ds4718421@gmail.com",
            contactPhone: "+91-9975133445",
            contactLocation: "Maharashtra"
        });

        console.log("Seeding Done");
        process.exit();

    } catch (error) {
        console.log(error);
        process.exit();
    }
};

portfolioInfo();
