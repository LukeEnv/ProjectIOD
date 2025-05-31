import { Router } from "express";
import userController from "../controller/user.controller";

const router = Router();

// router.get("/", userController);

router.get("/", (req, res) => {
    userController.getUsers(res);
});

router.post("/", (req, res) => {
    userController.createUser(req.body, res);
});

export default router;
