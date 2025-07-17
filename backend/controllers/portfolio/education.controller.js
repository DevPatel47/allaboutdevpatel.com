import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiError } from '../../utils/ApiError.js';
import User from '../../models/common/user.model.js';
import Education from '../../models/portfolio/education.model.js';
import { uploadOnCloudinary, deleteFromCloudinary } from '../../utils/cloudinary.js';
import { ApiResponse } from '../../utils/ApiResponse.js';

/**
 * Create a new education entry for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} 201 - Created education entry
 */
const createEducation = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const institution = req.body?.institution?.trim();
    const degree = req.body?.degree?.trim();
    const fieldOfStudy = req.body?.fieldOfStudy?.trim();
    const startDate = req.body?.startDate;
    const endDate = req.body?.endDate;
    const grade = req.body?.grade?.trim();
    const description = req.body?.description?.trim();

    // Validate required fields
    if (
        !userId ||
        !institution ||
        !degree ||
        !fieldOfStudy ||
        !startDate ||
        !endDate ||
        !grade ||
        !description
    ) {
        return res.status(400).json(new ApiError(400, 'All fields are required'));
    }

    // Only allow the user themselves
    if (userId.toString() !== req.user._id.toString()) {
        return res
            .status(403)
            .json(new ApiError(403, 'You are not authorized to create this education'));
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

    // Create and save education
    const newEducation = await Education.create({
        userId,
        institution,
        degree,
        fieldOfStudy,
        startDate,
        endDate,
        grade,
        description,
        logo: logoUrl,
    });

    if (!newEducation) {
        return res.status(500).json(new ApiError(500, 'Failed to create education'));
    }

    return res
        .status(201)
        .json(new ApiResponse(201, 'Education created successfully', { education: newEducation }));
});

/**
 * Get all education entries for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object[]} 200 - List of education entries
 */
const getEducationsByUserId = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    // Validate userId
    if (!userId) {
        return res.status(400).json(new ApiError(400, 'User ID is required'));
    }

    // Fetch educations for the user
    const educations = await Education.find({ userId }).sort({ startDate: -1 });

    if (!educations || educations.length === 0) {
        return res.status(404).json(new ApiError(404, 'No educations found for this user'));
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, 'Educations retrieved successfully', { educations: educations }),
        );
});

/**
 * Get a specific education entry by its ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} 200 - Education entry
 */
const getEducationByEduId = asyncHandler(async (req, res) => {
    const { educationId } = req.params;

    // Validate educationId
    if (!educationId) {
        return res.status(400).json(new ApiError(400, 'Education ID is required'));
    }

    // Fetch education by ID
    const education = await Education.findById(educationId);

    if (!education) {
        return res.status(404).json(new ApiError(404, 'Education not found'));
    }

    return res
        .status(200)
        .json(new ApiResponse(200, 'Education retrieved successfully', { education: education }));
});

/**
 * Update an education entry by its ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} 200 - Updated education entry
 */
const updateEducation = asyncHandler(async (req, res) => {
    const { educationId } = req.params;
    const institution = req.body?.institution?.trim();
    const degree = req.body?.degree?.trim();
    const fieldOfStudy = req.body?.fieldOfStudy?.trim();
    const startDate = req.body?.startDate;
    const endDate = req.body?.endDate;
    const grade = req.body?.grade?.trim();
    const description = req.body?.description?.trim();

    // Validate required fields
    if (
        !educationId ||
        !institution ||
        !degree ||
        !fieldOfStudy ||
        !startDate ||
        !endDate ||
        !grade ||
        !description
    ) {
        return res.status(400).json(new ApiError(400, 'All fields are required'));
    }

    // Check if education exists
    const education = await Education.findById(educationId);
    if (!education) {
        return res.status(404).json(new ApiError(404, 'Education not found'));
    }

    // Only allow the user themselves
    if (education.userId.toString() != req.user._id.toString()) {
        return res
            .status(403)
            .json(new ApiError(403, 'You are not authorized to update this education'));
    }

    const oldLogoUrl = education.logo;

    // Handle logo upload if provided
    let logoUrl = '';
    if (req.files?.logo?.length > 0) {
        const logo = req.files.logo[0];
        const uploadResult = await uploadOnCloudinary(logo.path);
        logoUrl = uploadResult?.url;
    }

    const updatedEducation = await Education.findByIdAndUpdate(
        educationId,
        {
            institution,
            degree,
            fieldOfStudy,
            startDate,
            endDate,
            grade,
            description,
            logo: logoUrl || oldLogoUrl,
        },
        { new: true },
    );

    if (!updatedEducation) {
        return res.status(500).json(new ApiError(500, 'Failed to update education'));
    }

    // Delete old logo from Cloudinary if replaced
    if (logoUrl && oldLogoUrl && oldLogoUrl.includes('cloudinary.com')) {
        await deleteFromCloudinary(oldLogoUrl);
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, 'Education updated successfully', { education: updatedEducation }),
        );
});

/**
 * Delete an education entry by its ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} 200 - Deletion result
 */
const deleteEducation = asyncHandler(async (req, res) => {
    const { educationId } = req.params;

    // Validate educationId
    if (!educationId) {
        return res.status(400).json(new ApiError(400, 'Education ID is required'));
    }

    // Check if education exists
    const education = await Education.findById(educationId);
    if (!education) {
        return res.status(404).json(new ApiError(404, 'Education not found'));
    }

    // Only allow the user themselves
    if (education.userId.toString() !== req.user._id.toString()) {
        return res
            .status(403)
            .json(new ApiError(403, 'You are not authorized to delete this education'));
    }

    // Delete the education
    const deletedEducation = await Education.findByIdAndDelete(educationId);

    // Delete logo from Cloudinary if it exists
    if (education.logo && education.logo.includes('cloudinary.com')) {
        await deleteFromCloudinary(education.logo);
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, 'Education deleted successfully', { education: deletedEducation }),
        );
});

// Export all controller functions
export {
    createEducation,
    getEducationsByUserId,
    getEducationByEduId,
    updateEducation,
    deleteEducation,
};
