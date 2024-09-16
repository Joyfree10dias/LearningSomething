import { Router } from "express";
import { 
    defaultCall, 
    useGenerateContent, 
    useGenerateContentStream 
} from "../controllers/gemini.controller.js"
const router = Router();

// Routes
router.route("/").get(defaultCall);
router.route("/generate-content").get(useGenerateContent);
router.route("/generate-content-stream").get(useGenerateContentStream);

export default router;