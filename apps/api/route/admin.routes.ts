import { Router } from "express";
import {
    getPortfolio,
    createPortfolio,
    updatePortfolio,
    deletePortfolio,
    getSkill,
    getExperince,
    getProject,
    updateSkill,
    updateExperience,
    updateProject,
    createSkill,
    createExp,
    deleteSkill,
    deleteExp,
    deleteProject,
    createProject
} from "../controller/admin.controller";
import { uploadProject, uploadProfile } from "../utils/uploader";
import { protectAdmin } from "../middleware/auth.middleware";

const router = Router();

router.get("/info-get", getPortfolio)
    .post("/info-create", protectAdmin, createPortfolio)
    .put("/info-modify/:pid", protectAdmin, uploadProfile, updatePortfolio)
    .delete("/info-remove/:pid", protectAdmin, deletePortfolio)

    .post("/info-create-skill", protectAdmin, createSkill)
    .post("/info-create-exp", protectAdmin, createExp)
    .post("/info-create-project", protectAdmin, uploadProject, createProject)
    .get("/info-skill", getSkill)
    .get("/info-exp", getExperince)
    .get("/info-project", getProject)
    .put("/info-up-skill/:sid", protectAdmin, updateSkill)
    .put("/info-up-exp/:eid", protectAdmin, updateExperience)
    .put("/info-up-project/:pid", protectAdmin, uploadProject, updateProject)
    .delete("/info-remove-skill/:sid", protectAdmin, deleteSkill)
    .delete("/info-remove-exp/:eid", protectAdmin, deleteExp)
    .delete("/info-remove-project/:pid", protectAdmin, deleteProject);

export default router;
