import { Router } from "express";
import { loginAdmin, AdminLogout } from "../controller/auth.controller";

const router = Router();

router
    .post("/admin-signin", loginAdmin)
    .post("/admin-signout", AdminLogout);

export default router;
