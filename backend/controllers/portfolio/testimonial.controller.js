import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiError } from '../../utils/ApiError.js';
import User from '../../models/common/user.model.js';
import Testimonial from '../../models/portfolio/testimonial.model.js';
import { uploadOnCloudinary, deleteFromCloudinary } from '../../utils/cloudinary.js';
import { ApiResponse } from '../../utils/ApiResponse.js';

/**
 * Create a new testimonial entry for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} 201 - Created testimonial entry
 */
const createTestimonial = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const name = req.body?.name?.trim();
    const role = req.body?.role?.trim();
    const content = req.body?.content?.trim();
    const linkedIn = req.body?.linkedIn?.trim();

    // Validate required fields
    if (!userId || !name || !role || !content) {
        return res
            .status(400)
            .json(new ApiError(400, 'User ID, name, role, and content are required'));
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json(new ApiError(404, 'User not found'));
    }

    // Handle image upload if provided
    let imageUrl = '';
    if (req.file) {
        const uploadResult = await uploadOnCloudinary(req.file.path);
        imageUrl = uploadResult?.url;
    }

    // Create and save testimonial
    const newTestimonial = await Testimonial.create({
        userId,
        name,
        role,
        content,
        image: imageUrl,
        linkedIn: linkedIn || '',
    });

    if (!newTestimonial) {
        return res.status(500).json(new ApiError(500, 'Failed to create testimonial'));
    }

    return res.status(201).json(
        new ApiResponse(201, 'Testimonial created successfully', {
            testimonial: newTestimonial,
        }),
    );
});

/**
 * Get all testimonial entries for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object[]} 200 - List of testimonial entries
 */
const getTestimonialsByUserId = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    // Validate userId
    if (!userId) {
        return res.status(400).json(new ApiError(400, 'User ID is required'));
    }

    // Fetch testimonials for the user
    const testimonials = await Testimonial.find({ userId }).sort({ createdAt: -1 });

    if (!testimonials || testimonials.length === 0) {
        return res.status(404).json(new ApiError(404, 'No testimonials found for this user'));
    }

    return res
        .status(200)
        .json(new ApiResponse(200, 'Testimonials fetched successfully', { testimonials }));
});

/**
 * Get a specific testimonial entry by its ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} 200 - Testimonial entry
 */
const getTestimonialById = asyncHandler(async (req, res) => {
    const { testimonialId } = req.params;

    // Validate testimonialId
    if (!testimonialId) {
        return res.status(400).json(new ApiError(400, 'Testimonial ID is required'));
    }

    // Fetch testimonial by ID
    const testimonial = await Testimonial.findById(testimonialId);
    if (!testimonial) {
        return res.status(404).json(new ApiError(404, 'Testimonial not found'));
    }

    return res
        .status(200)
        .json(new ApiResponse(200, 'Testimonial fetched successfully', { testimonial }));
});

/**
 * Update a testimonial entry by its ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} 200 - Updated testimonial entry
 */
const updateTestimonial = asyncHandler(async (req, res) => {
    const { testimonialId } = req.params;
    const name = req.body?.name?.trim();
    const role = req.body?.role?.trim();
    const content = req.body?.content?.trim();
    const linkedIn = req.body?.linkedIn?.trim();

    // Validate required fields
    if (!testimonialId || !name || !role || !content) {
        return res
            .status(400)
            .json(new ApiError(400, 'Testimonial ID, name, role, and content are required'));
    }

    // Check if testimonial exists
    const testimonial = await Testimonial.findById(testimonialId);
    if (!testimonial) {
        return res.status(404).json(new ApiError(404, 'Testimonial not found'));
    }

    // Only allow the user themselves to update
    if (testimonial.userId.toString() !== req.user._id.toString()) {
        return res
            .status(403)
            .json(new ApiError(403, 'You are not authorized to update this testimonial'));
    }

    const oldImageUrl = testimonial.image;

    // Handle image upload if provided
    let imageUrl = '';
    if (req.file) {
        const uploadResult = await uploadOnCloudinary(req.file.path);
        imageUrl = uploadResult?.url;
    }

    // Update testimonial
    const updatedTestimonial = await Testimonial.findByIdAndUpdate(
        testimonialId,
        {
            name,
            role,
            content,
            image: imageUrl || oldImageUrl,
            linkedIn: linkedIn || '',
        },
        { new: true },
    );

    if (!updatedTestimonial) {
        return res.status(500).json(new ApiError(500, 'Failed to update testimonial'));
    }

    // Delete old image from Cloudinary if replaced
    if (imageUrl && oldImageUrl && oldImageUrl.includes('cloudinary.com')) {
        await deleteFromCloudinary(oldImageUrl);
    }

    return res.status(200).json(
        new ApiResponse(200, 'Testimonial updated successfully', {
            testimonial: updatedTestimonial,
        }),
    );
});

/**
 * Delete a testimonial entry by its ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} 200 - Deletion result
 */
const deleteTestimonial = asyncHandler(async (req, res) => {
    const { testimonialId } = req.params;

    // Validate testimonialId
    if (!testimonialId) {
        return res.status(400).json(new ApiError(400, 'Testimonial ID is required'));
    }

    // Check if testimonial exists
    const testimonial = await Testimonial.findById(testimonialId);
    if (!testimonial) {
        return res.status(404).json(new ApiError(404, 'Testimonial not found'));
    }

    // Only allow the user themselves to delete
    if (testimonial.userId.toString() !== req.user._id.toString()) {
        return res
            .status(403)
            .json(new ApiError(403, 'You are not authorized to delete this testimonial'));
    }

    // Delete testimonial
    const deletedTestimonial = await Testimonial.findByIdAndDelete(testimonialId);

    if (!deletedTestimonial) {
        return res.status(500).json(new ApiError(500, 'Failed to delete testimonial'));
    }

    // Delete image from Cloudinary if it exists
    if (testimonial.image && testimonial.image.includes('cloudinary.com')) {
        await deleteFromCloudinary(testimonial.image);
    }

    return res.status(200).json(
        new ApiResponse(200, 'Testimonial deleted successfully', {
            testimonial: deletedTestimonial,
        }),
    );
});

// Export all controller functions
export {
    createTestimonial,
    getTestimonialsByUserId,
    getTestimonialById,
    updateTestimonial,
    deleteTestimonial,
};
