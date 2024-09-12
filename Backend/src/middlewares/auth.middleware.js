import jwt from "jsonwebtoken";
import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";


export const verifyJWT = asyncHandler( async (req, res, next) => {

    try {
        // Get cookies 
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        console.log("Token: ", token);
    
        // check if the token exists
        if (!token) {
            throw new apiError(401, "Unauthorized");
        }
    
        // Decode the token 
        const decodedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        console.log("Decoded Token: ", decodedToken);
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
    
        // Validate user 
        if(!user) {
            throw new apiError(401, "Invalid Access Token!!");
        }
    
        req.user = user;
        next();
    } catch (error) {
        throw new apiError(401, error?.message || "Unauthorized");
    }
} );