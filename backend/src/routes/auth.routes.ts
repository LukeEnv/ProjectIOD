import { Router } from "express";
import {
  loginUser,
  refreshToken,
  logoutUser,
} from "../controller/auth.controller";

const router = Router();

router.post("/login", async (req, res) => {
  await loginUser(req, res);
});
router.post("/refresh-token", async (req, res) => {
  await refreshToken(req, res);
});
router.post("/refresh-token/logout", async (req, res) => {
  await logoutUser(req, res);
});

export default router;
