import { GeminiModels } from "../constants.js";
import { connectToGEMINI } from "../utils/Gemini.js";
console.log(GeminiModels);

// for '/' path 
const defaultCall = async (req, res) => {
    try {
        const geminiModel = await connectToGEMINI();
        console.log(geminiModel);
        res.status(200).send("Connected to Gemini!!");
    } catch (error) {
        throw error;
    }
};

// Using generateContent 
const useGenerateContent = async (req, res) => {
    try {
        const { model, propmt } = req.body;

        // Verify if the model exists 
        if (!GeminiModels[req.body.model]) {
            return res.status(400).json({ error: "Invalid model" });
        }

        // Connect to Gemini 
        const geminiModel = await connectToGEMINI();
        const prompt = "write a code for adding two numbers in javascript";
        const response = await geminiModel.generateContent(prompt);
        console.log("Response: ", response);

        // Extract the response from the API 
        let message = response.response?.text();
        console.log("Message: ", message);

        // Return response 
        return res.status(200)
        .json({ message });
    } catch (error) {
        throw error;
    }
};

// Using generateContentStream 
const useGenerateContentStream = async (req, res) => {
    try {
        const { model, propmt } = req.body;

        // Verify if the model exists 
        if (!GeminiModels[req.body.model]) {
            return res.status(400).json({ error: "Invalid model" });
        }

        const geminiModel = await connectToGEMINI();
        const prompt = "write a long story about a dog";
        const response = await geminiModel.generateContentStream(prompt);
        console.log("Response: ", response);
        
        let message = "";

        // Print text as it comes in.
        for await (const chunk of response.stream) {
            const chunkText = chunk.text();
            process.stdout.write(chunkText);
            message += chunkText;
        }

        // Return response 
        return res.status(200)
        .json({ message });
    } catch (error) {
        throw error;
    }
};

export {
    defaultCall,
    useGenerateContent,
    useGenerateContentStream
}

