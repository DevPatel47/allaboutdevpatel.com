/**
 * ApiResponse Class
 * Standardized response class for API responses.
 * Includes status code, message, data payload, and success flag.
 */
class ApiResponse {
    /**
     * Constructs a new ApiResponse instance.
     * @param {number} statusCode - HTTP status code for the response.
     * @param {string} [message="Success"] - Response message.
     * @param {*} [data=null] - Data payload for the response.
     */
    constructor(statusCode, message = "Success", data = null) {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
    }
}

export { ApiResponse };