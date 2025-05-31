import { Router } from "express";
import customerController from "../controller/customer.controller";

const router = Router();

router.get("/", customerController);

export default router;
