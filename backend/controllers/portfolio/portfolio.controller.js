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

    if (!username?.trim()) {
        throw new ApiError(400, 'Username is required');
    }

    // Fetch only _id and username
    const user = await User.findOne({ username: username.trim() }).select('_id username').lean();

    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    const userId = user._id;

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
        Testimonial.find({ userId }).lean(),
    ]);

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

    return res
        .status(200)
        .json(new ApiResponse(200, 'Portfolio fetched successfully', { portfolio }));
});

export { getPortfolioByUsername };
