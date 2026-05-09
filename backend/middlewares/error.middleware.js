import multer from 'multer';

import { ApiError } from '../utils/ApiError.js';

const getFriendlyUploadMessage = (error) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return 'Image is too large. Please upload a smaller file.';
        }

        if (error.code === 'LIMIT_UNEXPECTED_FILE') {
            return 'Unexpected file upload. Please try again.';
        }

        return 'Invalid file upload. Please try again.';
    }

    return null;
};

const errorHandler = (error, req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }

    const statusCode = error?.statusCode || error?.status || 500;
    const uploadMessage = getFriendlyUploadMessage(error);
    const message =
        uploadMessage || error?.message || error?.errorMessage || 'Something went wrong';

    return res.status(statusCode).json(new ApiError(statusCode, message, error?.errors || []));
};

export { errorHandler };
