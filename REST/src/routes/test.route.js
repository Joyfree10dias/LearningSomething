import { Router } from "express";
import { testController } from "../controllers/test.controller.js"

const router = Router();

// Routes 
router.route("/").get(testController);

export default router;