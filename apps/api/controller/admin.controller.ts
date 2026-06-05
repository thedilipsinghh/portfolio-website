import { Request, Response } from "express";
import { db, portfolios, skills, projects, experiences } from "@portfolio/shared";
import { eq } from "drizzle-orm";
import { cloudinary } from "../utils/uploader";
import { triggerRevalidation } from "../utils/revalidate";

//  hero section get controller 
export const getPortfolio = async (req: Request, res: Response): Promise<void> => {
    try {
        const results = await db.select().from(portfolios).limit(1);
        const PResult = results[0] ? {
            _id: results[0].id.toString(),
            id: results[0].id,
            hero: {
                name: results[0].heroName,
                title: results[0].heroTitle,
                profileImage: results[0].heroProfileImage,
                resume: results[0].heroResume,
            },
            about: {
                description1: results[0].aboutDescription1,
                description2: results[0].aboutDescription2,
            },
            stats: {
                yearsExperience: results[0].statsYearsExperience,
                projectsCompleted: results[0].statsProjectsCompleted,
                technologies: results[0].statsTechnologies,
                happyClients: results[0].statsHappyClients,
            },
            contact: {
                email: results[0].contactEmail,
                phone: results[0].contactPhone,
                location: results[0].contactLocation,
            },
            social: {
                github: results[0].socialGithub,
                linkedin: results[0].socialLinkedin,
                twitter: results[0].socialTwitter,
                instagram: results[0].socialInstagram,
            }
        } : null;

        res.status(200).json({ message: "Portfolio Data fetch Success", PResult });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

//  skill section get controller 
export const getSkill = async (req: Request, res: Response): Promise<void> => {
    try {
        const results = await db.select().from(skills);
        const SResult = results.map(item => ({
            _id: item.id.toString(),
            id: item.id,
            name: item.name
        }));
        res.status(200).json({ message: "Skill Data fetch Success", SResult });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

//  project section get controller 
export const getProject = async (req: Request, res: Response): Promise<void> => {
    try {
        const results = await db.select().from(projects);
        const PResult = results.map(item => ({
            _id: item.id.toString(),
            id: item.id,
            title: item.title,
            description: item.description,
            note: item.note,
            image: item.image,
            tags: item.tags,
            liveLink: item.liveLink,
            githubLink: item.githubLink
        }));
        res.status(200).json({ message: "Project Data fetch Success", PResult });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

//  Experience section get controller 
export const getExperince = async (req: Request, res: Response): Promise<void> => {
    try {
        const results = await db.select().from(experiences);
        const EResult = results.map(item => ({
            _id: item.id.toString(),
            id: item.id,
            title: item.title,
            place: item.place,
            date: item.date,
            type: item.type,
            description: item.description
        }));
        res.status(200).json({ message: "Experinece Data fetch Success", EResult });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// create Portfolio controller 
export const createPortfolio = async (req: Request, res: Response): Promise<void> => {
    try {
        const body = req.body;
        const insertData = {
            heroName: body.hero?.name,
            heroTitle: body.hero?.title,
            heroProfileImage: body.hero?.profileImage,
            heroResume: body.hero?.resume,
            aboutDescription1: body.about?.description1,
            aboutDescription2: body.about?.description2,
            statsYearsExperience: body.stats?.yearsExperience,
            statsProjectsCompleted: body.stats?.projectsCompleted,
            statsTechnologies: body.stats?.technologies,
            statsHappyClients: body.stats?.happyClients,
            contactEmail: body.contact?.email,
            contactPhone: body.contact?.phone,
            contactLocation: body.contact?.location,
            socialGithub: body.social?.github,
            socialLinkedin: body.social?.linkedin,
            socialTwitter: body.social?.twitter,
            socialInstagram: body.social?.instagram,
        };
        const results = await db.insert(portfolios).values(insertData).returning();
        const Portfolioresult = results[0];
        triggerRevalidation();
        res.status(200).json({ message: "Portfolio Details Create Success", Portfolioresult });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// experience create controller
export const createExp = async (req: Request, res: Response): Promise<void> => {
    try {
        const results = await db.insert(experiences).values({
            title: req.body.title,
            place: req.body.place,
            date: req.body.date,
            type: req.body.type,
            description: req.body.description
        }).returning();
        const Expresult = results[0];
        triggerRevalidation();
        res.status(200).json({ message: "Experience Details Create Success", Expresult });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Skill  create controller
export const createSkill = async (req: Request, res: Response): Promise<void> => {
    try {
        const results = await db.insert(skills).values({
            name: req.body.name
        }).returning();
        const Skillresult = results[0];
        triggerRevalidation();
        res.status(200).json({ message: "Skill Details Create Success", Skillresult });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Project  create controller
export const createProject = async (req: Request, res: Response): Promise<void> => {
    try {
        const file = req.file;
        console.log("create - project", file);
        if (!file) {
            res.status(400).json({ message: "Image required" });
            return;
        }
        const result = await cloudinary.uploader.upload(file.path, {
            folder: "projects"
        });
        const results = await db.insert(projects).values({
            title: req.body.title,
            description: req.body.description,
            note: req.body.note,
            image: result.secure_url,
            tags: req.body.tags,
            liveLink: req.body.liveLink,
            githubLink: req.body.githubLink
        }).returning();
        const newProject = results[0];
        triggerRevalidation();
        res.json(newProject);
    } catch (err: any) {
        console.log(err);
        res.status(500).json({ message: "Upload failed" });
    }
};

// hero section update controller 
export const updatePortfolio = async (req: Request, res: Response): Promise<void> => {
    try {
        const { pid } = req.params;
        const id = parseInt(pid as string, 10);
        const results = await db.select().from(portfolios).where(eq(portfolios.id, id)).limit(1);
        const existingPortfolio = results[0];
        if (!existingPortfolio) {
            res.status(404).json({ message: "Portfolio not found" });
            return;
        }

        const updateData: any = { ...req.body };
        const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

        if (files) {
            if (files.profileImage && files.profileImage[0]) {
                const result = await cloudinary.uploader.upload(files.profileImage[0].path, {
                    folder: "portfolio/profiles",
                    resource_type: "image"
                });
                updateData.profileImage = result.secure_url;
            }
            if (files.resume && files.resume[0]) {
                const result = await cloudinary.uploader.upload(files.resume[0].path, {
                    folder: "portfolio/resumes",
                    resource_type: "raw",
                    public_id: `Dilip_Resume.pdf`,
                    use_filename: false,
                    unique_filename: false,
                    overwrite: true
                });
                updateData.resume = result.secure_url;
            }
        }

        const finalUpdate = {
            heroName: req.body.name || req.body.hero?.name || existingPortfolio.heroName,
            heroTitle: req.body.title || req.body.hero?.title || existingPortfolio.heroTitle,
            heroProfileImage: updateData.profileImage || req.body.hero?.profileImage || existingPortfolio.heroProfileImage,
            heroResume: updateData.resume || req.body.hero?.resume || existingPortfolio.heroResume,
            aboutDescription1: req.body.about?.description1 || existingPortfolio.aboutDescription1,
            aboutDescription2: req.body.about?.description2 || existingPortfolio.aboutDescription2,
            statsYearsExperience: req.body.stats?.yearsExperience !== undefined ? Number(req.body.stats.yearsExperience) : existingPortfolio.statsYearsExperience,
            statsProjectsCompleted: req.body.stats?.projectsCompleted !== undefined ? Number(req.body.stats.projectsCompleted) : existingPortfolio.statsProjectsCompleted,
            statsTechnologies: req.body.stats?.technologies !== undefined ? Number(req.body.stats.technologies) : existingPortfolio.statsTechnologies,
            statsHappyClients: req.body.stats?.happyClients !== undefined ? Number(req.body.stats.happyClients) : existingPortfolio.statsHappyClients,
            contactEmail: req.body.contact?.email || existingPortfolio.contactEmail,
            contactPhone: req.body.contact?.phone || existingPortfolio.contactPhone,
            contactLocation: req.body.contact?.location || existingPortfolio.contactLocation,
            socialGithub: req.body.social?.github || existingPortfolio.socialGithub,
            socialLinkedin: req.body.social?.linkedin || existingPortfolio.socialLinkedin,
            socialTwitter: req.body.social?.twitter || existingPortfolio.socialTwitter,
            socialInstagram: req.body.social?.instagram || existingPortfolio.socialInstagram,
        };

        await db.update(portfolios).set(finalUpdate).where(eq(portfolios.id, id));
        triggerRevalidation();
        res.status(200).json({ message: "Portfolio update" });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// skill section update controller
export const updateSkill = async (req: Request, res: Response): Promise<void> => {
    try {
        const { sid } = req.params;
        const id = parseInt(sid as string, 10);
        await db.update(skills).set({ name: req.body.name }).where(eq(skills.id, id));
        triggerRevalidation();
        res.status(200).json({ message: "Skill update" });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// project section update controller
export const updateProject = async (req: Request, res: Response): Promise<void> => {
    try {
        const { pid } = req.params;
        const id = parseInt(pid as string, 10);
        
        const results = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
        const existingProject = results[0];
        if (!existingProject) {
            res.status(404).json({ message: "Project not found" });
            return;
        }

        const updateData = { ...req.body };

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "projects"
            });
            updateData.image = result.secure_url;
        }

        await db.update(projects).set({
            title: req.body.title || existingProject.title,
            description: req.body.description || existingProject.description,
            note: req.body.note || existingProject.note,
            image: updateData.image || existingProject.image,
            tags: req.body.tags || existingProject.tags,
            liveLink: req.body.liveLink || existingProject.liveLink,
            githubLink: req.body.githubLink || existingProject.githubLink
        }).where(eq(projects.id, id));

        res.status(200).json({ message: "Project update" });
        triggerRevalidation();
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Experience section update controller
export const updateExperience = async (req: Request, res: Response): Promise<void> => {
    try {
        const { eid } = req.params;
        const id = parseInt(eid as string, 10);
        
        const results = await db.select().from(experiences).where(eq(experiences.id, id)).limit(1);
        const existingExp = results[0];
        if (!existingExp) {
            res.status(404).json({ message: "Experience not found" });
            return;
        }

        await db.update(experiences).set({
            title: req.body.title || existingExp.title,
            place: req.body.place || existingExp.place,
            date: req.body.date || existingExp.date,
            type: req.body.type || existingExp.type,
            description: req.body.description || existingExp.description
        }).where(eq(experiences.id, id));
        
        res.status(200).json({ message: "Update Experience update" });
        triggerRevalidation();
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// delete Portfolio Controller
export const deletePortfolio = async (req: Request, res: Response): Promise<void> => {
    try {
        const { pid } = req.params;
        const id = parseInt(pid as string, 10);
        await db.delete(portfolios).where(eq(portfolios.id, id));
        triggerRevalidation();
        res.status(200).json({ message: "Portfolio deleted" });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// delete exp Controller
export const deleteExp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { eid } = req.params;
        const id = parseInt(eid as string, 10);
        await db.delete(experiences).where(eq(experiences.id, id));
        triggerRevalidation();
        res.status(200).json({ message: "Exp deleted" });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// delete Skill Controller
export const deleteSkill = async (req: Request, res: Response): Promise<void> => {
    try {
        const { sid } = req.params;
        const id = parseInt(sid as string, 10);
        await db.delete(skills).where(eq(skills.id, id));
        triggerRevalidation();
        res.status(200).json({ message: "Skill deleted" });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// delete Project Controller
export const deleteProject = async (req: Request, res: Response): Promise<void> => {
    try {
        const { pid } = req.params;
        const id = parseInt(pid as string, 10);
        await db.delete(projects).where(eq(projects.id, id));
        triggerRevalidation();
        res.status(200).json({ message: "Project deleted" });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
