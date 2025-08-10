import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';

// Models for each portfolio section
import User from '../../models/common/user.model.js';
import Introduction from '../../models/portfolio/introduction.model.js';
import Skill from '../../models/portfolio/skill.model.js';
import Project from '../../models/portfolio/project.model.js';
import Education from '../../models/portfolio/education.model.js';
import Experience from '../../models/portfolio/experience.model.js';
import Certification from '../../models/portfolio/certification.model.js';
import SocialLink from '../../models/portfolio/socialLink.model.js';
import Testimonial from '../../models/portfolio/testimonial.model.js';

/**
 * @route   GET /api/v1/portfolio/:username
 * @desc    Fetch complete portfolio by username, including all related sections
 * @access  Public
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with portfolio data or error message
 */
const getPortfolioByUsername = asyncHandler(async (req, res) => {
    const { username } = req.params;

    // Validate incoming username
    if (!username?.trim()) {
        throw new ApiError(400, 'Username is required');
    }

    // Find user by username, exclude sensitive fields
    const user = await User.findOne({ username: username.trim() })
        .select('-password -refreshToken')
        .lean();

    // If user doesn't exist, return 404
    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    const userId = user._id;

    // Fetch all portfolio sections in parallel using Promise.all
    const [
        introduction,
        skills,
        projects,
        education,
        experience,
        certifications,
        socialLinks,
        testimonials,
    ] = await Promise.all([
        Introduction.findOne({ userId }).lean(),
        Skill.find({ userId }).lean(),
        Project.find({ userId, featured: true }).lean(),
        Education.find({ userId }).lean(),
        Experience.find({ userId }).lean(),
        Certification.find({ userId }).lean(),
        SocialLink.find({ userId }).lean(),
        Testimonial.find({}).lean(),
    ]);

    // Build a complete portfolio object
    const portfolio = {
        user,
        introduction: introduction || {},
        skills: skills || [],
        projects: projects || [],
        education: education || [],
        experience: experience || [],
        certifications: certifications || [],
        socialLinks: socialLinks || [],
        testimonials: testimonials || [],
    };

    // Send success response
    return res
        .status(200)
        .json(new ApiResponse(200, 'Portfolio fetched successfully', { portfolio }));
});

export { getPortfolioByUsername };
