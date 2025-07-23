import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiError } from '../../utils/ApiError.js';
import User from '../../models/common/user.model.js';
import SocialLink from '../../models/portfolio/socialLink.model.js';
import { ApiResponse } from '../../utils/ApiResponse.js';

/**
 * Create one or more social link entries for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} 201 - Created social link entries
 */

const createSocialLink = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const platform = req.body?.platform?.trim();
    const url = req.body?.url?.trim();
    const icon = req.body?.icon?.trim() || '';

    // Validate required fields
    if (!userId || !platform || !url) {
        return res.status(400).json(new ApiError(400, 'User ID, platform, and url are required'));
    }

    // Only allow the user themselves
    if (userId.toString() !== req.user._id.toString()) {
        return res
            .status(403)
            .json(new ApiError(403, 'You are not authorized to create this social link'));
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json(new ApiError(404, 'User not found'));
    }

    // Create social link
    const newSocialLink = await SocialLink.create({
        userId,
        platform,
        url,
        icon,
    });

    if (!newSocialLink) {
        return res.status(500).json(new ApiError(500, 'Failed to create social link'));
    }

    return res
        .status(201)
        .json(
            new ApiResponse(201, 'Social link created successfully', { socialLink: newSocialLink }),
        );
});

/**
 * Get all social link entries for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object[]} 200 - List of social link entries
 */
const getSocialLinksByUserId = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json(new ApiError(400, 'User ID is required'));
    }

    const socialLinks = await SocialLink.find({ userId }).sort({ createdAt: -1 });

    if (!socialLinks || socialLinks.length === 0) {
        return res.status(404).json(new ApiError(404, 'No social links found for this user'));
    }

    return res
        .status(200)
        .json(new ApiResponse(200, 'Social links retrieved successfully', { socialLinks }));
});

/**
 * Get a specific social link entry by its ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} 200 - Social link entry
 */
const getSocialLinkById = asyncHandler(async (req, res) => {
    const { socialLinkId } = req.params;

    if (!socialLinkId) {
        return res.status(400).json(new ApiError(400, 'Social link ID is required'));
    }

    const socialLink = await SocialLink.findById(socialLinkId);

    if (!socialLink) {
        return res.status(404).json(new ApiError(404, 'Social link not found'));
    }

    return res
        .status(200)
        .json(new ApiResponse(200, 'Social link retrieved successfully', { socialLink }));
});

/**
 * Update a social link entry by its ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} 200 - Updated social link entry
 */
const updateSocialLink = asyncHandler(async (req, res) => {
    const { socialLinkId } = req.params;
    const platform = req.body?.platform?.trim();
    const url = req.body?.url?.trim();
    const icon = req.body?.icon?.trim() || '';

    if (!socialLinkId || !platform || !url) {
        return res.status(400).json(new ApiError(400, 'All fields (platform, url) are required'));
    }

    const socialLink = await SocialLink.findById(socialLinkId);
    if (!socialLink) {
        return res.status(404).json(new ApiError(404, 'Social link not found'));
    }

    // Only allow the user themselves
    if (socialLink.userId.toString() !== req.user._id.toString()) {
        return res
            .status(403)
            .json(new ApiError(403, 'You are not authorized to update this social link'));
    }

    const updatedSocialLink = await SocialLink.findByIdAndUpdate(
        socialLinkId,
        { platform, url, icon },
        { new: true },
    );

    if (!updatedSocialLink) {
        return res.status(500).json(new ApiError(500, 'Failed to update social link'));
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, 'Social link updated successfully', {
                socialLink: updatedSocialLink,
            }),
        );
});

/**
 * Delete a social link entry by its ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} 200 - Deletion result
 */
const deleteSocialLink = asyncHandler(async (req, res) => {
    const { socialLinkId } = req.params;

    if (!socialLinkId) {
        return res.status(400).json(new ApiError(400, 'Social link ID is required'));
    }

    const socialLink = await SocialLink.findById(socialLinkId);
    if (!socialLink) {
        return res.status(404).json(new ApiError(404, 'Social link not found'));
    }

    // Only allow the user themselves
    if (socialLink.userId.toString() !== req.user._id.toString()) {
        return res
            .status(403)
            .json(new ApiError(403, 'You are not authorized to delete this social link'));
    }

    const deletedSocialLink = await SocialLink.findByIdAndDelete(socialLinkId);

    return res
        .status(200)
        .json(
            new ApiResponse(200, 'Social link deleted successfully', {
                socialLink: deletedSocialLink,
            }),
        );
});

// Export all controller functions
export {
    createSocialLink,
    getSocialLinksByUserId,
    getSocialLinkById,
    updateSocialLink,
    deleteSocialLink,
};
