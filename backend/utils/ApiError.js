/**
 * ApiError Class
 * Custom error class for handling API errors in a standardized format.
 * Extends the built-in Error class and includes additional properties
 * such as statusCode, errorMessage, errors array, and stack trace.
 */
class ApiError extends Error {
  /**
   * Constructs a new ApiError instance.
   * @param {number} statusCode - HTTP status code for the error.
   * @param {string} [message="Something went wrong"] - Error message.
   * @param {Array} [errors=[]] - Additional error details.
   * @param {string} [stack=""] - Optional stack trace.
   */
  constructor(statusCode, message="Something went wrong", errors=[], stack="") {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.errorMessage = message;
    this.success = false;
    this.errors = errors;

    // Set the stack trace for debugging
    if (stack) {
        this.stack = stack;
    } else {
        Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };