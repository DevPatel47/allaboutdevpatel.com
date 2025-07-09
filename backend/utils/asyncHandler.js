/**
 * asyncHandler Utility
 * Wraps asynchronous route handlers and forwards errors to Express error handlers.
 * Ensures that any unhandled promise rejections are caught and passed to next().
 * @param {Function} requestHandler - The async route handler function.
 * @returns {Function} - A function that handles errors for the async route handler.
 */
const asyncHandler = (requestHandler) => {  
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
    };
}

export { asyncHandler };