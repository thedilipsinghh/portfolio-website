CREATE TABLE "admins" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(255),
	"password" text,
	"mobile" bigint,
	"role" varchar(50),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "admins_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "experiences" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255),
	"place" varchar(255),
	"date" varchar(255),
	"type" varchar(50),
	"description" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "portfolios" (
	"id" serial PRIMARY KEY NOT NULL,
	"hero_name" varchar(255),
	"hero_title" varchar(255),
	"hero_profile_image" text,
	"hero_resume" text,
	"about_description1" text,
	"about_description2" text,
	"stats_years_experience" integer,
	"stats_projects_completed" integer,
	"stats_technologies" integer,
	"stats_happy_clients" integer,
	"contact_email" varchar(255),
	"contact_phone" varchar(50),
	"contact_location" varchar(255),
	"social_github" text,
	"social_linkedin" text,
	"social_twitter" text,
	"social_instagram" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255),
	"description" text,
	"note" text,
	"image" text,
	"tags" text,
	"live_link" text,
	"github_link" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "skills" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
