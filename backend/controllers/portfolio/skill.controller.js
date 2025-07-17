import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiError } from '../../utils/ApiError.js';
import User from '../../models/common/user.model.js';
import Skill from '../../models/portfolio/skill.model.js';
import { ApiResponse } from '../../utils/ApiResponse.js';

/**
 * Create a new skill entry for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} 201 - Created skill entry
 */
const createSkill = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const category = req.body?.category?.trim();
    const commaSeparatedSkills = req.body?.skills?.trim();

    // Parse skills from comma-separated string (format: "HTML:Beginner, CSS:Intermediate")
    const skills = commaSeparatedSkills
        ? commaSeparatedSkills.split(',').map((item) => {
              const [name, level] = item.split(':').map((s) => s.trim());
              return { name, level };
          })
        : [];

    // Validate required fields
    if (!userId || !category || !skills.length) {
        return res.status(400).json(new ApiError(400, 'All fields are required'));
    }

    // Validate skill entries
    for (const skill of skills) {
        if (
            !skill.name ||
            !skill.level ||
            !['Beginner', 'Intermediate', 'Advanced'].includes(skill.level)
        ) {
            return res
                .status(400)
                .json(
                    new ApiError(
                        400,
                        'Each skill must include a name and a valid level (Beginner, Intermediate, Advanced)',
                    ),
                );
        }
    }

    // Only allow the user themselves
    if (userId.toString() !== req.user._id.toString()) {
        return res
            .status(403)
            .json(new ApiError(403, 'You are not authorized to create this skill entry'));
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json(new ApiError(404, 'User not found'));
    }

    // Create and save the skill entry
    const newSkill = await Skill.create({
        userId,
        category,
        skills,
    });

    if (!newSkill) {
        return res.status(500).json(new ApiError(500, 'Failed to create skill entry'));
    }

    return res
        .status(201)
        .json(new ApiResponse(201, 'Skill entry created successfully', { skill: newSkill }));
});

/**
 * Get all skill entries for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object[]} 200 - List of skill entries
 */
const getSkillsByUserId = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    // Validate userId
    if (!userId) {
        return res.status(400).json(new ApiError(400, 'User ID is required'));
    }

    // Fetch skills for the user
    const skills = await Skill.find({ userId }).sort({ createdAt: -1 });

    if (!skills || skills.length === 0) {
        return res.status(404).json(new ApiError(404, 'No skills found for this user'));
    }

    return res
        .status(200)
        .json(new ApiResponse(200, 'Skills fetched successfully', { skills: skills }));
});

/**
 * Get a specific skill entry by its ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} 200 - Skill entry
 */
const getSkillBySkillId = asyncHandler(async (req, res) => {
    const { skillId } = req.params;

    // Validate skillId
    if (!skillId) {
        return res.status(400).json(new ApiError(400, 'Skill ID is required'));
    }

    // Fetch skill by ID
    const skill = await Skill.findById(skillId);
    if (!skill) {
        return res.status(404).json(new ApiError(404, 'Skill not found'));
    }

    return res
        .status(200)
        .json(new ApiResponse(200, 'Skill fetched successfully', { skill: skill }));
});

/**
 * Update a skill entry by its ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} 200 - Updated skill entry
 */
const updateSkill = asyncHandler(async (req, res) => {
    const { skillId } = req.params;
    const category = req.body?.category?.trim();
    const commaSeparatedSkills = req.body?.skills?.trim();

    // Parse skills (e.g., "HTML:Beginner, CSS:Intermediate")
    const skills = commaSeparatedSkills
        ? commaSeparatedSkills.split(',').map((item) => {
              const [name, level] = item.split(':').map((s) => s.trim());
              return { name, level };
          })
        : [];

    // Validate required fields
    if (!skillId || !category || !skills.length) {
        return res.status(400).json(new ApiError(400, 'All fields are required'));
    }

    // Validate each skill entry
    for (const skill of skills) {
        if (
            !skill.name ||
            !skill.level ||
            !['Beginner', 'Intermediate', 'Advanced'].includes(skill.level)
        ) {
            return res
                .status(400)
                .json(
                    new ApiError(
                        400,
                        'Each skill must include a valid name and level (Beginner, Intermediate, Advanced)',
                    ),
                );
        }
    }

    // Check if skill entry exists
    const skillEntry = await Skill.findById(skillId);
    if (!skillEntry) {
        return res.status(404).json(new ApiError(404, 'Skill entry not found'));
    }

    // Only allow the user themselves
    if (skillEntry.userId.toString() !== req.user._id.toString()) {
        return res
            .status(403)
            .json(new ApiError(403, 'You are not authorized to update this skill entry'));
    }

    // Update skill entry
    const updatedSkill = await Skill.findByIdAndUpdate(
        skillId,
        {
            category,
            skills,
        },
        { new: true },
    );

    if (!updatedSkill) {
        return res.status(500).json(new ApiError(500, 'Failed to update skill entry'));
    }

    return res.status(200).json(
        new ApiResponse(200, 'Skill entry updated successfully', {
            skill: updatedSkill,
        }),
    );
});

/**
 * Delete a skill entry by its ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} 200 - Deletion result
 */
const deleteSkill = asyncHandler(async (req, res) => {
    const { skillId } = req.params;

    // Validate skillId
    if (!skillId) {
        return res.status(400).json(new ApiError(400, 'Skill ID is required'));
    }

    // Check if skill entry exists
    const skillEntry = await Skill.findById(skillId);
    if (!skillEntry) {
        return res.status(404).json(new ApiError(404, 'Skill entry not found'));
    }

    // Only allow the user themselves
    if (skillEntry.userId.toString() !== req.user._id.toString()) {
        return res
            .status(403)
            .json(new ApiError(403, 'You are not authorized to delete this skill entry'));
    }

    // Delete skill entry
    const deletedSkillEntry = await Skill.findByIdAndDelete(skillId);

    if (!deletedSkillEntry) {
        return res.status(500).json(new ApiError(500, 'Failed to delete skill entry'));
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, 'Skill entry deleted successfully', { skill: deletedSkillEntry }),
        );
});

/**
 * Exports the skill controller functions
 */
export { createSkill, getSkillsByUserId, getSkillBySkillId, updateSkill, deleteSkill };
