import { Router } from "express";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../controller/task.controller";
import { requireAuth } from "../middleware/requireAuth.middleware";

const router = Router();

router.get("/", requireAuth, getTasks);
router.post("/", requireAuth, createTask);
router.put("/:id", requireAuth, updateTask);
router.delete("/:id", requireAuth, deleteTask);

export default router;
