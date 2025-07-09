import multer from "multer";

/**
 * Multer storage configuration for handling file uploads.
 * Files are stored in the './public/temp' directory with their original filenames.
 */
const storage = multer.diskStorage({
    // Set destination directory for uploaded files
    destination: (req, file, cb) => {
        cb(null, "./public/temp");
    },
    // Set filename for uploaded files (original name)
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

/**
 * Multer middleware instance for handling multipart/form-data (file uploads).
 */
export const upload = multer({
    storage
});