import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";

// Register a user 
const registerUser = asyncHandler( async (req, res) => {
    // console.log("req.body: ", req.body);
    // console.log("req.files: ", req.files);
    const {username, email, fullname, password} = req.body;
    console.log(username, email, fullname, password);

    // Validation
    if (
        [username, email, fullname, password].some((field) => field?.trim() === "")
    ){
        throw new apiError(400, "all fields are required");
    }

    // Check if the user already exists with the same username or email 
    const existedUser = await User.findOne({
        $or: [{username}, {email}]
    })
    console.log("Existed user: " + existedUser);

    if (existedUser){
        throw new apiError(409, "User with username or email already exists");
    }

    // Validation for files
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }
    console.log("avatar Local Path: " + avatarLocalPath);
    console.log("coverImage Local Path: " + coverImageLocalPath);


    if (!avatarLocalPath){
        throw new apiError(400, "Avatar is required");
    }
    
    // Upload to Cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    // console.log("avatar: ", avatar);
    // console.log("coverImage: ", coverImage);

    // Validation for db
    if (!avatar){
        throw new apiError(400, "Avatar upload failed");
    }

    // Create User
    let user = await User.create({
        username: username.toLowerCase(),
        email,
        fullname,
        password,
        avatar: avatar.secure_url,
        coverImage: coverImage?.secure_url || ""
    })
    console.log("user: ", user);

    // Check if the use is created
    if (!user){
        throw new apiError(500, "Something went wrong while registering a user!");
    }

    // Remove password and refresh token from user before sending it to frontend
    user = user.toObject();
    delete user.password;
    console.log("user: ", user);

    // Return a response
    return res.status(201).json(
        new apiResponse(201, user, "User registered successfully"),
    )

} );

// Helper function to generate tokens (Access and Refersh)
const generateTokens = async (user) => {
    try {
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // Save the refresh token inside db for the user
        user.refreshToken = refreshToken;
        const updatedUser = await user.save({ validateBeforeSave: false });
        console.log("updatedUser: ", updatedUser);

        return { accessToken, refreshToken };

    } catch (error) {
        throw new apiError(500, "Something went wrong while generating tokens");
    }
};

// User login
const loginUser = asyncHandler( async (req, res) => {
    const {username, email, password} = req.body;

    // Validate if username or email exists 
    if (!username && !email) {
        throw new apiError(400, "username or email is required");
    }

    //Validate if password exists
    if (!password) {
        throw new apiError(400, "password is required");
    }

    // Find the user
    const user = await User.findOne({
        $or: [{username}, {email}]
    })
    console.log("user: ", user);

    // Check if the user exists
    if (!user) {
        throw new apiError(404, "user not found");
    }

    // Check if the password is corerct
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new apiError(401, "Invalid password");
    }

    // Generate Access and Refresh tokens
    const { accessToken, refreshToken } = await generateTokens(user);

    // set some options for cookies
    const options = {
        httpOnly: true,
        secure: true
    }

    // Return response 
    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new apiResponse(
                200,
                {
                    user: user, accessToken, refreshToken
                },
                "User logged in successfully"
            )
        );
    
} );

// User logout 
const logoutUser = asyncHandler( async (req, res) => {

    // Get user 
    console.log("req.user: ", req.user);
    const userId = req.user._id;
    console.log("userId: ", userId);
    const updatedUser = await User.findByIdAndUpdate(userId, {
        // This is used to remove the property from the document (refreshToken)
        // $unset: {
        //     refreshToken: ""
        // }

        // This is used to set the property to null (refreshToken)
        $set: {
            refreshToken: null
        }
    },
    {
        new: true
    }
    );

    console.log("updatedUser: ", updatedUser);

    const options = {
        httpOnly: true,
        secure: true
    }

    // Return response 
    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new apiResponse(200, {}, "User logged out!!!")
        )

    
} );

// Refreah User access token 
const refreshAccessToken = asyncHandler( async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;

    // Check if the incoming refresh token exists
    if (!incomingRefreshToken) {
        throw new apiError(401, "Unauthorized request");
    }

    try {
        // verify the incoming refresh token 
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        console.log("decodedToken: ", decodedToken);
    
        // Find the user
        const user = await User.findById(decodedToken?._id).select("-password");
        console.log("user: ", user);
    
        // Check if the user exists
        if (!user) {
            throw new apiError(404, "user not found");
        }
    
        // Check if the refresh token is valid 
        if (user?.refreshToken !== incomingRefreshToken) {
            throw new appiError(401, "Refresh token has expired or used");
        }
        
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const { accessToken, refreshToken } = await generateTokens(user);
    
        return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new apiResponse(
                200,
                {
                    accessToken, refreshToken
                },
                "Access token refreshed successfully"
            )
        );
    } catch (error) {
        throw new apiError(401, error?.message || "Invalid refresh token");
    }
} );

// Change current user password 
const changeCurrentPassword = asyncHandler( async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    // Validation
    if (!oldPassword || !newPassword) {
        throw new apiError(400, "Old password and new password are required!");
    }

    // Find the user 
    const userId = req.user?._id;
    if (!userId) {
        throw new apiError(404, "User not found");
    }

    const user = await User.findById(userId);

    // Check if the user exists
    if (!user) {
        throw new apiError(404, "User not found");
    }

    // Check if the old password is correct
    if (!await user.isPasswordCorrect(oldPassword)) {
        throw new apiError(401, "Invalid user password!");
    }

    // Change to new password
    user.password = newPassword; 
    const updatedUser = user.save({ validateBeforeSave: false });
    console.log("updatedUser: ", updatedUser);

    // Return response
    return res.status(200)
    .json(
        new apiResponse(200, {}, "Password changed successfully")
    );

} );

// Fetch current user
const getCurrentUser = asyncHandler( async (res, req) => {
    return res.status(200)
    .json(
        new apiResponse(200, req.user, "User fetched successfully")
    );
} );

// Update user account details 
const updateAccountDetails = asyncHandler( async (req, res) => {
    const { email, fullname } = req.body;
    // Validation
    if (!email && !fullname) {
        throw new apiError(400, "Email or fullname is required!");
    }

    // Find and update the user 
    const userId = req.user?._id;
    if (!userId) {
        throw new apiError(404, "User not found");
    }

    const updatedUser = User.findByIdAndUpdate(userId, {
        $set: {
            email,
            fullname
            }
        },
        {
            new: true
        }
    ).select("-password");

    // Return response
    return res.status(200)
    .json(
        new apiResponse(200, updatedUser, "User updated successfully")
    );
} );

// Update user avatar 
const updateUserAvatar = asyncHandler( async (req, res) => {
    const avatarLocalPath = req.files?.path;
    // Validate 
    if (!avatarLocalPath) {
        throw new apiError(400, "Avatar file is missing!!");
    }

    //Delete the existing avatar on Cloudinary

    // Upload on Cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);

    // Validate for db
    if (!avatar) {
        throw new apiError(400, "Avatar upload failed");
    }

    const userId = req.user?._id;
    if (!userId) {
        throw new apiError(404, "User not found");
    }

    // Find and update the user 
    const updatedUser = User.findByIdAndUpdate(userId, {
        $set: {
            avatar: avatar.secure_url
            }
        },
        {
            new: true
        }
    ).select("-password");

    // Return response
    res.status(200)
    .json(
        new apiResponse(200, updatedUser, "User avatar updated successfully")
    );

} );

export { 
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar
 };