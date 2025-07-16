import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import User from "../models/common/user.model.js";
import jwt from "jsonwebtoken";

/**
 * Middleware to verify JWT access tokens for protected routes.
 * Checks for token in cookies or Authorization header.
 * If valid, attaches the user object to the request; otherwise, returns 401 error.
 */
export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        // Retrieve token from cookies or Authorization header
        const token =
            req.cookies?.accessToken ||
            req.headers("Authorization")?.replace("Bearer ", "");

        // If no token is found, return unauthorized error
        if (!token) {
            new ApiError(401, "Unauthorization request");
        }
        // Verify token using secret
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        // Find user by decoded token ID, excluding sensitive fields
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
    
        // If user not found, return unauthorized error
        if (!user) {
            throw new ApiError(401, "Invalid or expired token");
        }
    
        // Attach user to request and proceed
        req.user = user;
        next();
    } catch (error) {
        // Handle invalid or expired token
        return res.status(401).json(new ApiError(401, "Invalid or expired token"));
    }
});
