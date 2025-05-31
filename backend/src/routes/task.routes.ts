import { Router } from "express";
import taskController from "../controller/task.controller";

const router = Router();

router.get("/", taskController);

export default router;
