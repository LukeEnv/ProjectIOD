import { Router } from "express";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  addTaskComment,
  getTaskById,
} from "../controller/task.controller";
import { requireAuth } from "../middleware/requireAuth.middleware";

const router = Router();

router.get("/", requireAuth, getTasks);
router.post("/", requireAuth, createTask);
router.put("/:id", requireAuth, updateTask);
router.delete("/:id", requireAuth, deleteTask);
router.post("/:id/comments", requireAuth, addTaskComment);
router.get("/:id", requireAuth, getTaskById);

export default router;
