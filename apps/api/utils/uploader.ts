import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { Request } from "express";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_API_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadProfile = multer({
    storage: multer.diskStorage({}),
    fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
        const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("File type not supported"));
        }
    }
}).fields([
    { name: "profileImage", maxCount: 1 },
    { name: "resume", maxCount: 1 }
]);

export const uploadProject = multer({
    storage: multer.diskStorage({}),
    fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only images are allowed for projects"));
        }
    }
}).single("image");

export { cloudinary };
