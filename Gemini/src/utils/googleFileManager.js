import { fileManager } from "../index.js";
import fs from "fs";

// Upload to Google Files 
const uploadToGoogleFiles = async (localFilePath, mimeType, displayName) => {
    try {
        const uploadResults = await fileManager.uploadFile(
            localFilePath,
            {
                mimeType,
                displayName,
            },
        );
        console.log("Upload Result: ", uploadResults);
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