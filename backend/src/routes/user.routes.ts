import { Router } from "express";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getMe,
} from "../controller/user.controller";
import { requireAuth } from "../middleware/requireAuth.middleware";

const router = Router();

router.get("/me", requireAuth, getMe);
router.get("/", getUsers);
router.post("/", async (req, res) => {
  await createUser(req, res);
});
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
