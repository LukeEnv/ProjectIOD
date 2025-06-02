import { Router } from "express";
import authController from "../controller/auth.controller";

const router = Router();

router.get("/", authController);

export default router;
