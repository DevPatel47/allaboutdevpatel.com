import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiError } from '../../utils/ApiError.js';
import User from '../../models/common/user.model.js';
import Experience from '../../models/portfolio/experience.model.js';
import { uploadOnCloudinary, deleteFromCloudinary } from '../../utils/cloudinary.js';
import { ApiResponse } from '../../utils/ApiResponse.js';

/**
 * Create a new experience entry for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} 201 - Created experience entry
 */
const createExperience = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const title = req.body?.title?.trim();
    const company = req.body?.company?.trim();
    const location = req.body?.location?.trim();
    const startDate = req.body?.startDate;
    const endDate = req.body?.endDate;
    const commaSepratedResponsibilities = req.body?.responsibilities?.trim();
    const commaSepratedTechStack = req.body?.techStack?.trim();

    // Parse responsibilities and tech stack from comma-separated strings
    const responsibilities = commaSepratedResponsibilities
        ? commaSepratedResponsibilities.split(',').map((item) => item.trim())
        : [];
    const techStack = commaSepratedTechStack
        ? commaSepratedTechStack.split(',').map((item) => item.trim())
        : [];

    // Validate required fields
    if (
        !userId ||
        !title ||
        !company ||
        !location ||
        !startDate ||
        !responsibilities.length ||
        !techStack.length
    ) {
        return res.status(400).json(new ApiError(400, 'All fields are required'));
    }

    // Only allow the user themselves or an admin to create
    if (userId.toString() !== req.user._id.toString()) {
        return res
            .status(403)
            .json(new ApiError(403, 'You are not authorized to create this experience'));
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json(new ApiError(404, 'User not found'));
    }

    // Handle logo upload if provided
    let logoUrl = '';
    if (req.files?.logo?.length > 0) {
        const logo = req.files.logo[0];
        const uploadResult = await uploadOnCloudinary(logo.path);
        logoUrl = uploadResult?.url;
    }

    // Create and save experience
    const newExperience = await Experience.create({
        userId,
        title,
        company,
        location,
        startDate,
        endDate: endDate || null, 
        responsibilities,
        techStack,
        logo: logoUrl,
    });

    if (!newExperience) {
        return res.status(500).json(new ApiError(500, 'Failed to create experience'));
    }

    return res
        .status(201)
        .json(
            new ApiResponse(201, 'Experience created successfully', { experience: newExperience }),
        );
});

/**
 * Get all experience entries for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object[]} 200 - List of experience entries
 */
const getExperiencesByUserId = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    // Validate userId
    if (!userId) {
        return res.status(400).json(new ApiError(400, 'User ID is required'));
    }

    // Fetch experiences for the user
    const experiences = await Experience.find({ userId }).sort({ startDate: -1 });

    if (!experiences || experiences.length === 0) {
        return res.status(404).json(new ApiError(404, 'No experiences found for this user'));
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, 'Experiences fetched successfully', { experiences: experiences }),
        );
});

/**
 * Get a specific experience entry by its ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} 200 - Experience entry
 */
const getExperienceByExpId = asyncHandler(async (req, res) => {
    const { experienceId } = req.params;

    // Validate experienceId
    if (!experienceId) {
        return res.status(400).json(new ApiError(400, 'Experience ID is required'));
    }

    // Fetch experience by ID
    const experience = await Experience.findById(experienceId);

    if (!experience) {
        return res.status(404).json(new ApiError(404, 'Experience not found'));
    }

    return res
        .status(200)
        .json(new ApiResponse(200, 'Experience fetched successfully', { experience: experience }));
});

/**
 * Update an experience entry by its ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} 200 - Updated experience entry
 */
const updateExperience = asyncHandler(async (req, res) => {
    const { experienceId } = req.params;
    const title = req.body?.title?.trim();
    const company = req.body?.company?.trim();
    const location = req.body?.location?.trim();
    const startDate = req.body?.startDate;
    const endDate = req.body?.endDate;
    const commaSepratedResponsibilities = req.body?.responsibilities?.trim();
    const commaSepratedTechStack = req.body?.techStack?.trim();

    // Parse responsibilities and tech stack from comma-separated strings
    const responsibilities = commaSepratedResponsibilities
        ? commaSepratedResponsibilities.split(',').map((item) => item.trim())
        : [];
    const techStack = commaSepratedTechStack
        ? commaSepratedTechStack.split(',').map((item) => item.trim())
        : [];

    // Validate required fields
    if (
        !experienceId ||
        !title ||
        !company ||
        !location ||
        !startDate ||
        !responsibilities.length ||
        !techStack.length
    ) {
        return res.status(400).json(new ApiError(400, 'All fields are required'));
    }

    // Check if experience exists
    const experience = await Experience.findById(experienceId);
    if (!experience) {
        return res.status(404).json(new ApiError(404, 'Experience not found'));
    }

    // Only allow the user themselves or an admin to update
    if (experience.userId.toString() !== req.user._id.toString() && !req.user.isAdmin) {
        return res
            .status(403)
            .json(new ApiError(403, 'You are not authorized to update this experience'));
    }

    const oldLogoUrl = experience.logo;

    // Handle logo upload if provided
    let logoUrl = '';
    if (req.files?.logo?.length > 0) {
        const logo = req.files.logo[0];
        const uploadResult = await uploadOnCloudinary(logo.path);
        logoUrl = uploadResult?.url;
    }

    // Update experience
    const updatedExperience = await Experience.findByIdAndUpdate(
        experienceId,
        {
            title,
            company,
            location,
            startDate,
            endDate: endDate || null,
            responsibilities,
            techStack,
            logo: logoUrl || oldLogoUrl,
        },
        { new: true },
    );

    if (!updatedExperience) {
        return res.status(500).json(new ApiError(500, 'Failed to update experience'));
    }

    // Delete old logo from Cloudinary if replaced
    if (logoUrl && oldLogoUrl && oldLogoUrl.includes('cloudinary.com')) {
        await deleteFromCloudinary(oldLogoUrl);
    }

    return res.status(200).json(
        new ApiResponse(200, 'Experience updated successfully', {
            experience: updatedExperience,
        }),
    );
});

/**
 * Delete an experience entry by its ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} 200 - Deletion result
 */
const deleteExperience = asyncHandler(async (req, res) => {
    const { experienceId } = req.params;

    // Validate experienceId
    if (!experienceId) {
        return res.status(400).json(new ApiError(400, 'Experience ID is required'));
    }

    // Check if experience exists
    const experience = await Experience.findById(experienceId);
    if (!experience) {
        return res.status(404).json(new ApiError(404, 'Experience not found'));
    }

    // Only allow the user themselves
    if (experience.userId.toString() !== req.user._id.toString()) {
        return res
            .status(403)
            .json(new ApiError(403, 'You are not authorized to delete this experience'));
    }

    // Delete the experience
    const deletedExperience = await Experience.findByIdAndDelete(experienceId);

    if (!deletedExperience) {
        return res.status(500).json(new ApiError(500, 'Failed to delete experience'));
    }

    // Delete logo from Cloudinary if it exists
    if (experience.logo && experience.logo.includes('cloudinary.com')) {
        await deleteFromCloudinary(experience.logo);
    }

    return res.status(200).json(
        new ApiResponse(200, 'Experience deleted successfully', {
            experience: deletedExperience,
        }),
    );
});

// Export all controller functions
export {
    createExperience,
    getExperiencesByUserId,
    getExperienceByExpId,
    updateExperience,
    deleteExperience,
};
