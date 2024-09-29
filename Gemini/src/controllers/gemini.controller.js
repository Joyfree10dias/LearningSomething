import { GeminiModels } from "../constants.js";
import { connectToGEMINI } from "../utils/Gemini.js";
import { uploadToGoogleFiles } from "../utils/googleFileManager.js";
import readline from "readline";
import fs from "fs";

// Create a readline interface 
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    output: null
})

// convert file to generative part 
function fileToGenerativePart(path, mimeType) {
    return {
      inlineData: {
        data: Buffer.from(fs.readFileSync(path)).toString("base64"),
        mimeType,
      },
    };
}

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
        const { model, prompt } = req.body;

        // Verify if the model exists 
        if (!GeminiModels[req.body.model]) {
            return res.status(400).json({ error: "Invalid model" });
        }

        // Connect to Gemini 
        const geminiModel = await connectToGEMINI(model);
        console.log("Prompt: ", prompt);
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
        const { model, prompt } = req.body;

        // Verify if the model exists 
        if (!GeminiModels[req.body.model]) {
            return res.status(400).json({ error: "Invalid model" });
        }

        const geminiModel = await connectToGEMINI(model);
        console.log("Prompt: ", prompt);
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

// Using chat 
const useGeminiChat = async (req, res) => {
    const { model } = req.body;
    let response = "";

    // Verify if the model exists 
    if (!GeminiModels[req.body.model]) {
        return res.status(400).json({ error: "Invalid model" });
    }

    // Start the chat 
    const geminiModel = await connectToGEMINI(model);
    const chatSession = geminiModel.startChat();
    
    // Send the message and extract the response from the API
    function askQuestion() {
        process.stdout.write("User: ");
        rl.question('', async (input) => {
          if (input.toLowerCase() === 'exit') {
            console.log("\x1b[34m%s\x1b[0m", "Gemini: Thank you for chatting with me!\n");
            rl.close(); // Close the interface to exit
          } else {
            const response = await chatSession.sendMessage(input);
            console.log("\x1b[34m%s\x1b[0m", `Gemini: ${response.response?.text()} \n`);
            askQuestion(); // Call the function again to prompt for more input
          }
        });
      }
    askQuestion();

    // Access the chat history
    // const chatHistory = await chatSession.getHistory();
    // console.log("Chat History: \n", chatHistory.map((message) => message.parts));

    // Return response 
    return await res.status(200)
    .send("You can chat with Gemini AI in terminal");
};

// Generate Content using text and pictures 
const useGenerateContentWithImage = async (req, res) => {
    const { model, prompt } = req.body;
    const imagePath = req.file?.path;
    console.log(imagePath);

    // Verify if the model exists 
    if (!GeminiModels[req.body.model]) {
        return res.status(400).json({ error: "Invalid model" });
    }

    // Verify if the image exists 
    if(!imagePath) {
        return res.status(400).json({ error: "Image required"});
    }

    // Connect to Gemini 
    const geminiModel = await connectToGEMINI(model);
    console.log("Prompt: ", prompt);

    const imagePart = fileToGenerativePart(imagePath, req.file?.mimetype);
    const response = await geminiModel.generateContent([prompt, imagePart]);
    console.log("Response: ", response);

    // Extract the message from response
    let message = response.response.text();
    console.log("Message: ", message);

    // Delete the uploaded file 
    fs.unlinkSync(imagePath);

    // Return response 
    return res.status(200)
    .json({ message });
};


// Genearte Content using files (PDF) 
const useGenerateContentWithFile = async (req, res) => {
    const { model, prompt } = req.body;
    const imagePath = req.file?.path;

    // Verify if the model exists 
    if (!GeminiModels[req.body.model]) {
        return res.status(400).json({ error: "Invalid model" });
    }

    // Verify if the file exists
    if(!imagePath) {
        return res.status(400).json({ error: "File required"});
    }

    // Upload to files 
    const uploadResult = await uploadToGoogleFiles(imagePath, req.file?.mimetype, req.file?.orignalname);

    const geminiModel = await connectToGEMINI(model);
    console.log("Prompt: ", prompt);
    const response = await geminiModel.generateContent([
        prompt,
        {
            fileData: {
                fileUri: uploadResult.file.uri,
                mimeType: uploadResult.file.mimeType,
            }
        }
    ]);
    console.log("Response: ", response);

    // Extract the message from response 
    let message = response.response.text();
    console.log("Message: ", message);

    // Return response 
    return res.status(200)
    .json({ message });
    
};

// Generate Content using text and video 
const useGenerateContentWithVideo = async (req, res) => {
    const { model, prompt } = req.body;
    const videoPath = req.file?.path;
    console.log(videoPath);

    // Verify if the model exists 
    if (!GeminiModels[req.body.model]) {
        return res.status(400).json({ error: "Invalid model" });
    }

    // Verify if the video exists 
    if(!videoPath) {
        return res.status(400).json({ error: "Video required"});
    }

    // Upload the video to files 
    const uploadResult = await uploadToGoogleFiles(videoPath, req.file?.mimetype, req.file?.orignalname);

    if (!uploadResult) {
        return res.status(500).json({ error: "Failed to upload video" });
    }

    // Connect to Gemini 
    const geminiModel = await connectToGEMINI(model);
    console.log("Prompt: ", prompt);

    const response = await geminiModel.generateContent([
        {
            fileData: {
                fileUri: uploadResult.file.uri,
                mimeType: uploadResult.file.mimeType,
            }
        },
        {
            text: prompt,
        },
    ]);
    console.log("Response: ", response);

    // Extract the message from response 
    let message = response.response?.text();
    console.log("Message: ", message);

    // Return response 
    return res.status(200)
    .json({ message });
     
};

export {
    defaultCall,
    useGenerateContent,
    useGenerateContentStream,
    useGeminiChat,
    useGenerateContentWithImage,
    useGenerateContentWithFile,
    useGenerateContentWithVideo
}

