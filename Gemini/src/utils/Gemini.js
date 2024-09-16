import { GoogleGenerativeAI } from "@google/generative-ai"; 
import { geminiResponseSchema } from "../constants.js";

// Connect to Gemini 
const connectToGEMINI = async (model = "gemini-1.5-flash") => {
    try {
        const generativeAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
        const geminiModel = generativeAI.getGenerativeModel({
            model,
            generationConfig: {
                candidateCount: 1,
                // responseSchema: geminiResponseSchema,
                // responseMimeType: "application/json",
                temperature:0.5,
                maxOutputTokens: 1024,
            }
        });
        console.log("Connected to Gemini");
        return geminiModel;
    } catch (error) {
        throw new error;
    }
};

export { connectToGEMINI };