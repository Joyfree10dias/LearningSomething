import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET ,
    secure: true  // Return "https" URLs
});

// Create a method to upload a file
const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null  // We can also return an error saying "No file path provided"
        // Upload the file on Cloudinary
        const result = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        })
        console.log("result: ", result);
        // File has beeen uploaded successfully
        console.log("File has been uploaded on Cloudinary, URL: " + result.secure_url);
        fs.unlinkSync(localFilePath); // Remove the locally saved temporary file
        return result;
        
    } catch (error) {
        fs.unlinkSync(localFilePath); // Remove the locally saved temporary file
        console.log(error);
        return null;
    }
}

export { uploadOnCloudinary };
