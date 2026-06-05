import { Router } from "express";
import { sendContactMessage } from "../controller/email.controller";

const router = Router();

router.post("/contact-message", sendContactMessage);

export default router;
