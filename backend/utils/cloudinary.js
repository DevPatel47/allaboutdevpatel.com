import dotenv from 'dotenv';
dotenv.config();

import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload file
const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        });
        fs.unlink(localFilePath, () => {});
        return response;
    } catch (error) {
        fs.unlink(localFilePath, () => {});
        return null;
    }
};

// Delete file
const deleteFromCloudinary = async (oldUrl) => {
    const publicId = oldUrl.split("/").pop().split(".")[0];
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        return null;
    }
};

export { uploadOnCloudinary, deleteFromCloudinary };
