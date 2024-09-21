import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { 
    defaultCall, 
    useGenerateContent, 
    useGenerateContentStream,
    useGeminiChat,
    useGenerateContentWithImage 
} from "../controllers/gemini.controller.js"
const router = Router();

// Routes
router.route("/").get(defaultCall);
router.route("/generate-content").post(useGenerateContent);
router.route("/generate-content-stream").post(useGenerateContentStream);
router.route("/chat").post(useGeminiChat);
router.route("/generate-content-with-image").post(upload.single("image"), useGenerateContentWithImage)

export default router;