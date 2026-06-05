import { pgTable, serial, varchar, text, integer, bigint, timestamp } from "drizzle-orm/pg-core";

export const admins = pgTable("admins", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }),
    email: varchar("email", { length: 255 }).unique(),
    password: text("password"),
    mobile: bigint("mobile", { mode: "number" }),
    role: varchar("role", { length: 50 }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow()
});

export const portfolios = pgTable("portfolios", {
    id: serial("id").primaryKey(),
    heroName: varchar("hero_name", { length: 255 }),
    heroTitle: varchar("hero_title", { length: 255 }),
    heroProfileImage: text("hero_profile_image"),
    heroResume: text("hero_resume"),
    aboutDescription1: text("about_description1"),
    aboutDescription2: text("about_description2"),
    statsYearsExperience: integer("stats_years_experience"),
    statsProjectsCompleted: integer("stats_projects_completed"),
    statsTechnologies: integer("stats_technologies"),
    statsHappyClients: integer("stats_happy_clients"),
    contactEmail: varchar("contact_email", { length: 255 }),
    contactPhone: varchar("contact_phone", { length: 50 }),
    contactLocation: varchar("contact_location", { length: 255 }),
    socialGithub: text("social_github"),
    socialLinkedin: text("social_linkedin"),
    socialTwitter: text("social_twitter"),
    socialInstagram: text("social_instagram"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow()
});

export const experiences = pgTable("experiences", {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }),
    place: varchar("place", { length: 255 }),
    date: varchar("date", { length: 255 }),
    type: varchar("type", { length: 50 }),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow()
});

export const projects = pgTable("projects", {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }),
    description: text("description"),
    note: text("note"),
    image: text("image"),
    tags: text("tags"),
    liveLink: text("live_link"),
    githubLink: text("github_link"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow()
});

export const skills = pgTable("skills", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow()
});
