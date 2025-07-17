import mongoose from 'mongoose';
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * Middleware to validate MongoDB ObjectId from route params.
 * Defaults to validating `req.params.id`, but can be extended.
 */
export const verifyObjectId = asyncHandler(async (req, res, next) => {
    const keys = Object.keys(req.params);

    // Loop through all route params and validate those that look like IDs
    for (const key of keys) {
        const value = req.params[key];
        if (!mongoose.Types.ObjectId.isValid(value)) {
            return res.status(400).json(new ApiError(400, `Invalid ${key}`));
        }
    }

    next();
});
