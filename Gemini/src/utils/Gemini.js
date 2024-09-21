// import { geminiResponseSchema } from "../constants.js";
import { generativeAI } from "../index.js";

// Connect to Gemini 
const connectToGEMINI = async (model = "gemini-1.5-flash") => {
    try {
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
        console.log("Connected to Gemini AI");
        console.log("Gemini Model: ", geminiModel.model, "\n");
        return geminiModel;
    } catch (error) {
        throw new error;
    }
};

export { connectToGEMINI };