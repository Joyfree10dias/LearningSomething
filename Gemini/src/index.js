import dotenv from "dotenv";
// import { connectToGEMINI } from "./utils/Gemini.js";
dotenv.config({
    path: "./.env"
});
import app from "./app.js";

// // Connect to Gemini AI 
// export const geminiModel = await connectToGEMINI();
// console.log(geminiModel);
try {
    // Start Server 
    app.listen(process.env.PORT || 3000, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
} catch (error) {
    throw new error;
}
