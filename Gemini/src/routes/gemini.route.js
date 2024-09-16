import { Router } from "express";
import { 
    defaultCall, 
    useGenerateContent, 
    useGenerateContentStream,
    useGeminiChat 
} from "../controllers/gemini.controller.js"
const router = Router();

// Routes
router.route("/").get(defaultCall);
router.route("/generate-content").get(useGenerateContent);
router.route("/generate-content-stream").get(useGenerateContentStream);
router.route("/chat").get(useGeminiChat);

export default router;