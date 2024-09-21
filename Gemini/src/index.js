import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
// import { connectToGEMINI } from "./utils/Gemini.js";
dotenv.config({
    path: "./.env"
});
import app from "./app.js";

// Supply the API Key 
const generativeAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

try {
    // Start Server 
    app.listen(process.env.PORT || 3000, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
} catch (error) {
    throw new error;
}

export { generativeAI };
