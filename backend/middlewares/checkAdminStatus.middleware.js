import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * Middleware to verify if the current user has admin privileges.
 * If the user is not an admin, returns a 403 Forbidden error.
 * Otherwise, allows the request to proceed to the next middleware or route handler.
 */
export const verifyAdminStatus = asyncHandler(async (req, res, next) => {
    try {
        const isAdmin = req.user?.role === "admin";
        if (!isAdmin) {
            throw new ApiError(403, "You are not authorized to access this resource");
        }
        next();
    } catch (error) {
        return res.status(403).json(new ApiError(403, "You are not authorized to access this resource"));
    }
});
