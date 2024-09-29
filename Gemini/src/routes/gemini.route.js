import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { 
    defaultCall, 
    useGenerateContent, 
    useGenerateContentStream,
    useGeminiChat,
    useGenerateContentWithImage ,
    useGenerateContentWithFile,
    useGenerateContentWithVideo
} from "../controllers/gemini.controller.js"
const router = Router();

// Routes
router.route("/").get(defaultCall);
router.route("/generate-content").post(useGenerateContent);
router.route("/generate-content-stream").post(useGenerateContentStream);
router.route("/chat").post(useGeminiChat);
router.route("/generate-content-with-image").post(
    upload.single("image"), 
    useGenerateContentWithImage
);
router.route("/generate-content-with-file").post(
    upload.single("PDFdoc"), 
    useGenerateContentWithFile
);
router.route("/generate-content-with-video").post(
    upload.single("video"), 
    useGenerateContentWithVideo
);

export default router;