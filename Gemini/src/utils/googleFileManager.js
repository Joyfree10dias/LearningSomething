import { fileManager } from "../index.js";
import { FileState } from "@google/generative-ai/server";
import fs from "fs";

// Upload to Google Files 
const uploadToGoogleFiles = async (localFilePath, mimeType, displayName) => {
    try {
        let uploadResults;
        uploadResults = await fileManager.uploadFile(
            localFilePath,
            {
                mimeType,
                displayName,
            },
        );
        console.log("Upload Result: ", uploadResults);

        // Wait till file state is ACTIVE 
        while(uploadResults.file.state == FileState.PROCESSING) {
            await new Promise(resolve => setTimeout(resolve, 5000));
            uploadResults.file = await fileManager.getFile(uploadResults.file.name);
            // console.log("Upload Result: ", uploadResults);
        }

        if (uploadResults.state !== "ACTIVE") {
            throw new Error("File upload failed");
        }

        fs.unlinkSync(localFilePath);
        return uploadResults;

    } catch (error) {
        fs.unlinkSync(localFilePath);
        throw error;
    }
};


export { 
    uploadToGoogleFiles,
};