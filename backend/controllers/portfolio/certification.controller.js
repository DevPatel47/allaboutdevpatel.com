import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiError } from '../../utils/ApiError.js';
import User from '../../models/common/user.model.js';
import Certification from '../../models/portfolio/certification.model.js';
import { uploadOnCloudinary, deleteFromCloudinary } from '../../utils/cloudinary.js';
import { ApiResponse } from '../../utils/ApiResponse.js';

/**
 * Create a new certification entry for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} 201 - Created certification entry
 */
const createCertification = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const title = req.body?.title?.trim();
    const provider = req.body?.provider?.trim();
    const issueDate = req.body?.issueDate;
    const credentialId = req.body?.credentialId?.trim();
    const credentialUrl = req.body?.credentialUrl?.trim();

    // Validate required fields
    if (!userId || !title || !provider || !issueDate) {
        return res
            .status(400)
            .json(new ApiError(400, 'User ID, title, provider, and issue date are required'));
    }

    // Only allow the user themselves to create
    if (userId.toString() !== req.user._id.toString()) {
        return res
            .status(403)
            .json(new ApiError(403, 'You are not authorized to create this certification'));
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json(new ApiError(404, 'User not found'));
    }

    // Handle badge image upload if provided
    let badgeImageUrl = '';
    if (req.files?.badgeImage?.length > 0) {
        const badgeImage = req.files.badgeImage[0];
        const uploadResult = await uploadOnCloudinary(badgeImage.path);
        badgeImageUrl = uploadResult?.url;
    }

    // Create and save certification
    const newCertification = await Certification.create({
        userId,
        title,
        provider,
        issueDate,
        credentialId: credentialId || '',
        credentialUrl: credentialUrl || '',
        badgeImage: badgeImageUrl,
    });

    if (!newCertification) {
        return res.status(500).json(new ApiError(500, 'Failed to create certification'));
    }

    return res
        .status(201)
        .json(
            new ApiResponse(201, 'Certification created successfully', {
                certification: newCertification,
            }),
        );
});

/**
 * Get all certification entries for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object[]} 200 - List of certification entries
 */
const getCertificationsByUserId = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    // Validate userId
    if (!userId) {
        return res.status(400).json(new ApiError(400, 'User ID is required'));
    }

    // Fetch certifications for the user
    const certifications = await Certification.find({ userId }).sort({ issueDate: -1 });

    if (!certifications || certifications.length === 0) {
        return res.status(404).json(new ApiError(404, 'No certifications found for this user'));
    }

    return res
        .status(200)
        .json(new ApiResponse(200, 'Certifications fetched successfully', { certifications }));
});

/**
 * Get a specific certification entry by its ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} 200 - Certification entry
 */
const getCertificationByCertId = asyncHandler(async (req, res) => {
    const { certificationId } = req.params;

    // Validate certificationId
    if (!certificationId) {
        return res.status(400).json(new ApiError(400, 'Certification ID is required'));
    }

    // Fetch certification by ID
    const certification = await Certification.findById(certificationId);
    if (!certification) {
        return res.status(404).json(new ApiError(404, 'Certification not found'));
    }

    return res
        .status(200)
        .json(new ApiResponse(200, 'Certification fetched successfully', { certification }));
});

/**
 * Update a certification entry by its ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} 200 - Updated certification entry
 */
const updateCertification = asyncHandler(async (req, res) => {
    const { certificationId } = req.params;
    const title = req.body?.title?.trim();
    const provider = req.body?.provider?.trim();
    const issueDate = req.body?.issueDate;
    const credentialId = req.body?.credentialId?.trim();
    const credentialUrl = req.body?.credentialUrl?.trim();

    // Validate required fields
    if (!certificationId || !title || !provider || !issueDate) {
        return res
            .status(400)
            .json(
                new ApiError(400, 'Certification ID, title, provider, and issue date are required'),
            );
    }

    // Check if certification exists
    const certification = await Certification.findById(certificationId);
    if (!certification) {
        return res.status(404).json(new ApiError(404, 'Certification not found'));
    }

    // Only allow the user themselves to update
    if (certification.userId.toString() !== req.user._id.toString()) {
        return res
            .status(403)
            .json(new ApiError(403, 'You are not authorized to update this certification'));
    }

    const oldBadgeImageUrl = certification.badgeImage;

    // Handle badge image upload if provided
    let badgeImageUrl = '';
    if (req.files?.badgeImage?.length > 0) {
        const badgeImage = req.files.badgeImage[0];
        const uploadResult = await uploadOnCloudinary(badgeImage.path);
        badgeImageUrl = uploadResult?.url;
    }

    // Update certification
    const updatedCertification = await Certification.findByIdAndUpdate(
        certificationId,
        {
            title,
            provider,
            issueDate,
            credentialId: credentialId || '',
            credentialUrl: credentialUrl || '',
            badgeImage: badgeImageUrl || oldBadgeImageUrl,
        },
        { new: true },
    );

    if (!updatedCertification) {
        return res.status(500).json(new ApiError(500, 'Failed to update certification'));
    }

    // Delete old badge image from Cloudinary if replaced
    if (badgeImageUrl && oldBadgeImageUrl && oldBadgeImageUrl.includes('cloudinary.com')) {
        await deleteFromCloudinary(oldBadgeImageUrl);
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, 'Certification updated successfully', {
                certification: updatedCertification,
            }),
        );
});

/**
 * Delete a certification entry by its ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} 200 - Deletion result
 */
const deleteCertification = asyncHandler(async (req, res) => {
    const { certificationId } = req.params;

    // Validate certificationId
    if (!certificationId) {
        return res.status(400).json(new ApiError(400, 'Certification ID is required'));
    }

    // Check if certification exists
    const certification = await Certification.findById(certificationId);
    if (!certification) {
        return res.status(404).json(new ApiError(404, 'Certification not found'));
    }

    // Only allow the user themselves to delete
    if (certification.userId.toString() !== req.user._id.toString()) {
        return res
            .status(403)
            .json(new ApiError(403, 'You are not authorized to delete this certification'));
    }

    // Delete the certification
    const deletedCertification = await Certification.findByIdAndDelete(certificationId);

    if (!deletedCertification) {
        return res.status(500).json(new ApiError(500, 'Failed to delete certification'));
    }

    // Delete badge image from Cloudinary if it exists
    if (certification.badgeImage && certification.badgeImage.includes('cloudinary.com')) {
        await deleteFromCloudinary(certification.badgeImage);
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, 'Certification deleted successfully', {
                certification: deletedCertification,
            }),
        );
});

// Export all controller functions
export {
    createCertification,
    getCertificationsByUserId,
    getCertificationByCertId,
    updateCertification,
    deleteCertification,
};
