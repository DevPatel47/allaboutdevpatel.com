import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiError } from '../../utils/ApiError.js';
import User from '../../models/common/user.model.js';
import SocialLink from '../../models/portfolio/socialLink.model.js';
import { ApiResponse } from '../../utils/ApiResponse.js';

/**
 * Create a new social link entry for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} 201 - Created social link entry
 */
const createSocialLink = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const links = req.body?.links;

    // Validate required fields
    if (!userId || !Array.isArray(links) || links.length === 0) {
        return res
            .status(400)
            .json(new ApiError(400, 'User ID and at least one link are required'));
    }

    // Validate each link
    for (const link of links) {
        if (!link.platform || !link.url) {
            return res
                .status(400)
                .json(new ApiError(400, 'Each link must include platform and url'));
        }
    }

    // Only allow the user themselves to create
    if (userId.toString() !== req.user._id.toString()) {
        return res
            .status(403)
            .json(new ApiError(403, 'You are not authorized to create this social link entry'));
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json(new ApiError(404, 'User not found'));
    }

    // Create and save social link entry
    const newSocialLink = await SocialLink.create({
        userId,
        links,
    });

    if (!newSocialLink) {
        return res.status(500).json(new ApiError(500, 'Failed to create social link entry'));
    }

    return res
        .status(201)
        .json(
            new ApiResponse(201, 'Social link entry created successfully', {
                socialLink: newSocialLink,
            }),
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

    // Validate userId
    if (!userId) {
        return res.status(400).json(new ApiError(400, 'User ID is required'));
    }

    // Fetch social links for the user
    const socialLinks = await SocialLink.find({ userId }).sort({ createdAt: -1 });

    if (!socialLinks || socialLinks.length === 0) {
        return res.status(404).json(new ApiError(404, 'No social links found for this user'));
    }

    return res
        .status(200)
        .json(new ApiResponse(200, 'Social links fetched successfully', { socialLinks }));
});

/**
 * Get a specific social link entry by its ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} 200 - Social link entry
 */
const getSocialLinkById = asyncHandler(async (req, res) => {
    const { socialLinkId } = req.params;

    // Validate socialLinkId
    if (!socialLinkId) {
        return res.status(400).json(new ApiError(400, 'Social link ID is required'));
    }

    // Fetch social link by ID
    const socialLink = await SocialLink.findById(socialLinkId);
    if (!socialLink) {
        return res.status(404).json(new ApiError(404, 'Social link not found'));
    }

    return res
        .status(200)
        .json(new ApiResponse(200, 'Social link fetched successfully', { socialLink }));
});

/**
 * Update a social link entry by its ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} 200 - Updated social link entry
 */
const updateSocialLink = asyncHandler(async (req, res) => {
    const { socialLinkId } = req.params;
    const links = req.body?.links;

    // Validate required fields
    if (!socialLinkId || !Array.isArray(links) || links.length === 0) {
        return res
            .status(400)
            .json(new ApiError(400, 'Social link ID and at least one link are required'));
    }

    // Validate each link
    for (const link of links) {
        if (!link.platform || !link.url) {
            return res
                .status(400)
                .json(new ApiError(400, 'Each link must include platform and url'));
        }
    }

    // Check if social link entry exists
    const socialLinkEntry = await SocialLink.findById(socialLinkId);
    if (!socialLinkEntry) {
        return res.status(404).json(new ApiError(404, 'Social link entry not found'));
    }

    // Only allow the user themselves to update
    if (socialLinkEntry.userId.toString() !== req.user._id.toString()) {
        return res
            .status(403)
            .json(new ApiError(403, 'You are not authorized to update this social link entry'));
    }

    // Update social link entry
    const updatedSocialLink = await SocialLink.findByIdAndUpdate(
        socialLinkId,
        {
            links,
        },
        { new: true },
    );

    if (!updatedSocialLink) {
        return res.status(500).json(new ApiError(500, 'Failed to update social link entry'));
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, 'Social link entry updated successfully', {
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

    // Validate socialLinkId
    if (!socialLinkId) {
        return res.status(400).json(new ApiError(400, 'Social link ID is required'));
    }

    // Check if social link entry exists
    const socialLinkEntry = await SocialLink.findById(socialLinkId);
    if (!socialLinkEntry) {
        return res.status(404).json(new ApiError(404, 'Social link entry not found'));
    }

    // Only allow the user themselves to delete
    if (socialLinkEntry.userId.toString() !== req.user._id.toString()) {
        return res
            .status(403)
            .json(new ApiError(403, 'You are not authorized to delete this social link entry'));
    }

    // Delete social link entry
    const deletedSocialLinkEntry = await SocialLink.findByIdAndDelete(socialLinkId);

    if (!deletedSocialLinkEntry) {
        return res.status(500).json(new ApiError(500, 'Failed to delete social link entry'));
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, 'Social link entry deleted successfully', {
                socialLink: deletedSocialLinkEntry,
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
