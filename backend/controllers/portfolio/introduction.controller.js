import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiError } from '../../utils/ApiError.js';
import User from '../../models/common/user.model.js';
import Introduction from '../../models/portfolio/introduction.model.js';
import { uploadOnCloudinary, deleteFromCloudinary } from '../../utils/cloudinary.js';
import { ApiResponse } from '../../utils/ApiResponse.js';

/**
 * Create a new introduction for a user.
 * Only the user themselves can create their introduction.
 * Validates required fields and checks for duplicates.
 */
const createIntroduction = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    // Use safe trimming to avoid errors if fields are missing
    const greeting = req.body?.greeting?.trim();
    const name = req.body?.name?.trim();
    const tagline = req.body?.tagline?.trim();
    const description = req.body?.description?.trim();

    // Validate required fields
    if (!userId || !greeting || !name || !tagline || !description) {
        return res.status(400).json(new ApiError(400, 'All fields are required'));
    }

    // Only allow the user themselves to create their introduction
    if (userId.toString() !== req.user._id.toString()) {
        return res
            .status(403)
            .json(new ApiError(403, 'You are not authorized to create this introduction'));
    }

    // Check if user exists
    if (!(await User.findById(userId))) {
        return res.status(404).json(new ApiError(404, 'User not found'));
    }

    // Prevent duplicate introduction
    if (await Introduction.exists({ userId })) {
        return res.status(409).json(new ApiError(409, 'Introduction already exists for this user'));
    }

    // Handle profile image upload if provided
    let profileImageUrl = '';
    if (req.files?.profileImage?.length > 0) {
        const profileImage = req.files.profileImage[0];
        const uploadResult = await uploadOnCloudinary(profileImage.path);
        profileImageUrl = uploadResult?.url;
    }

    // Handle resume upload if provided
    let resumeUrl = '';
    if (req.files?.resume?.length > 0) {
        const resume = req.files.resume[0];
        const uploadResult = await uploadOnCloudinary(resume.path);
        resumeUrl = uploadResult?.url;
    }

    // Create and save introduction
    const newIntroduction = await Introduction.create({
        userId,
        greeting,
        name,
        tagline,
        description,
        profileImage: profileImageUrl,
        resume: resumeUrl,
    });

    if (!newIntroduction) {
        return res.status(500).json(new ApiError(500, 'Failed to create introduction'));
    }

    return res.status(201).json(
        new ApiResponse(201, 'Introduction created successfully', {
            introduction: newIntroduction,
        }),
    );
});

/**
 * Get the introduction for a user.
 * Returns 404 if not found.
 */
const getIntroduction = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json(new ApiError(400, 'User ID is required'));
    }

    const introduction = await Introduction.findOne({ userId });

    if (!introduction) {
        return res.status(404).json(new ApiError(404, 'Introduction not found for this user'));
    }

    return res.status(200).json(
        new ApiResponse(200, 'Introduction retrieved successfully', {
            introduction: introduction,
        }),
    );
});

/**
 * Update the introduction for a user.
 * Only the user themselves can update their introduction.
 * Allows partial updates.
 */
const updateIntroduction = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    // Use safe trimming and allow partial updates
    const greeting = req.body?.greeting?.trim();
    const name = req.body?.name?.trim();
    const tagline = req.body?.tagline?.trim();
    const description = req.body?.description?.trim();

    if (!userId) {
        return res.status(400).json(new ApiError(400, 'User ID is required'));
    }

    // Validate required fields
    if (!greeting || !name || !tagline || !description) {
        return res.status(400).json(new ApiError(400, 'All fields are required'));
    }

    // Only allow the user themselves to update their introduction
    if (userId.toString() !== req.user._id.toString()) {
        return res
            .status(403)
            .json(new ApiError(403, 'You are not authorized to update this introduction'));
    }

    const introduction = await Introduction.findOne({ userId });

    if (!introduction) {
        return res.status(404).json(new ApiError(404, 'Introduction not found for this user'));
    }

    const oldProfileImageUrl = introduction.profileImage;
    const oldResumeUrl = introduction.resume;

    // Handle profile image upload if provided
    let profileImageUrl = '';
    if (req.files?.profileImage?.length > 0) {
        const profileImage = req.files.profileImage[0];
        const uploadResult = await uploadOnCloudinary(profileImage.path);
        profileImageUrl = uploadResult?.url;
    }

    // Handle resume upload if provided
    let resumeUrl = '';
    if (req.files?.resume?.length > 0) {
        const resume = req.files.resume[0];
        const uploadResult = await uploadOnCloudinary(resume.path);
        resumeUrl = uploadResult?.url;
    }

    // Update introduction fields (partial update allowed)
    const updatedIntroduction = await Introduction.findByIdAndUpdate(
        introduction._id,
        {
            greeting: greeting ?? introduction.greeting,
            name: name ?? introduction.name,
            tagline: tagline ?? introduction.tagline,
            description: description ?? introduction.description,
            profileImage: profileImageUrl || oldProfileImageUrl,
            resume: resumeUrl || oldResumeUrl,
        },
        { new: true },
    );

    if (!updatedIntroduction) {
        return res.status(500).json(new ApiError(500, 'Failed to update introduction'));
    }

    // Delete old files from Cloudinary if new ones were uploaded
    if (profileImageUrl && oldProfileImageUrl && oldProfileImageUrl.includes('cloudinary.com')) {
        await deleteFromCloudinary(oldProfileImageUrl);
    }
    if (resumeUrl && oldResumeUrl && oldResumeUrl.includes('cloudinary.com')) {
        await deleteFromCloudinary(oldResumeUrl);
    }

    return res.status(200).json(
        new ApiResponse(200, 'Introduction updated successfully', {
            introduction: updatedIntroduction,
        }),
    );
});

/**
 * Delete the introduction for a user.
 * Only the user themselves can delete their introduction.
 * Deletes associated files from Cloudinary if present.
 */
const deleteIntroduction = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json(new ApiError(400, 'User ID is required'));
    }

    // Only allow the user themselves to delete their introduction
    if (userId.toString() !== req.user._id.toString()) {
        return res
            .status(403)
            .json(new ApiError(403, 'You are not authorized to delete this introduction'));
    }

    const introduction = await Introduction.findOne({ userId });

    if (!introduction) {
        return res.status(404).json(new ApiError(404, 'Introduction not found for this user'));
    }

    const oldProfileImageUrl = introduction.profileImage;
    const oldResumeUrl = introduction.resume;

    const deletedIntroduction = await Introduction.findByIdAndDelete(introduction._id);

    if (!deletedIntroduction) {
        return res.status(500).json(new ApiError(500, 'Failed to delete introduction'));
    }

    // Delete files from Cloudinary if they exist
    if (oldProfileImageUrl && oldProfileImageUrl.includes('cloudinary.com')) {
        await deleteFromCloudinary(oldProfileImageUrl);
    }
    if (oldResumeUrl && oldResumeUrl.includes('cloudinary.com')) {
        await deleteFromCloudinary(oldResumeUrl);
    }

    return res.status(200).json(
        new ApiResponse(200, 'Introduction deleted successfully', {
            introduction: deletedIntroduction,
        }),
    );
});

// Export controller functions
export { createIntroduction, getIntroduction, updateIntroduction, deleteIntroduction };
