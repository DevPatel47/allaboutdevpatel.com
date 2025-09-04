import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiError } from '../../utils/ApiError.js';
import User from '../../models/common/user.model.js';
import Project from '../../models/portfolio/project.model.js';
import { uploadOnCloudinary, deleteFromCloudinary } from '../../utils/cloudinary.js';
import { ApiResponse } from '../../utils/ApiResponse.js';

/**
 * Create a new project entry for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} 201 - Created project entry
 */
const createProject = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const title = req.body?.title?.trim();
    const slug = req.body?.slug?.trim();
    const description = req.body?.description?.trim();
    const commaSeparatedTechStack = req.body?.techStack?.trim();
    const video = req.body?.video?.trim();
    const liveLink = req.body?.liveLink?.trim();
    const repoLink = req.body?.repoLink?.trim();
    const commaSeparatedTags = req.body?.tags?.trim();
    const featured = req.body?.featured;

    // Parse tech stack and tags from comma-separated strings
    const techStack = commaSeparatedTechStack
        ? commaSeparatedTechStack.split(',').map((item) => item.trim())
        : [];
    const tags = commaSeparatedTags ? commaSeparatedTags.split(',').map((item) => item.trim()) : [];

    if (
        !userId ||
        !title ||
        !slug ||
        !description ||
        !techStack.length ||
        !repoLink ||
        !tags.length
    ) {
        return res.status(400).json(new ApiError(400, 'All fields are required'));
    }

    // Only allow the user themselves to create their introduction
    if (userId.toString() !== req.user._id.toString()) {
        return res
            .status(403)
            .json(new ApiError(403, 'You are not authorized to create this introduction'));
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json(new ApiError(404, 'User not found'));
    }

    // Prevent duplicate project slug
    if (await Project.exists({ slug })) {
        return res.status(409).json(new ApiError(409, 'Project with this slug already exists'));
    }

    // Handle thumbnail upload if provided
    let imageUrl = '';
    if (req.files?.image?.length > 0) {
        const image = req.files.image[0];
        const uploadResult = await uploadOnCloudinary(image.path);
        imageUrl = uploadResult?.url;
    }

    // Create the project
    const newProject = await Project.create({
        userId,
        title,
        slug,
        description,
        techStack,
        video: video || '',
        liveLink: liveLink || '',
        repoLink,
        tags,
        featured: featured || false,
        image: imageUrl,
    });

    if (!newProject) {
        return res.status(500).json(new ApiError(500, 'Failed to create project'));
    }

    return res
        .status(201)
        .json(new ApiResponse(201, 'Project created successfully', { project: newProject }));
});

/**
 * Get all project entries for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object[]} 200 - List of project entries
 */
const getProjectsByUserId = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    // Validate userId
    if (!userId) {
        return res.status(400).json(new ApiError(400, 'User ID is required'));
    }

    // Fetch projects for the user
    const projects = await Project.find({ userId }).sort({ createdAt: -1 });

    if (!projects || projects.length === 0) {
        return res.status(404).json(new ApiError(404, 'No projects found for this user'));
    }

    return res
        .status(200)
        .json(new ApiResponse(200, 'Projects fetched successfully', { projects: projects }));
});

/**
 * Get a specific project entry by its ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} 200 - Project entry
 */
const getProjectByProjectId = asyncHandler(async (req, res) => {
    const { projectId } = req.params;

    // Validate projectId
    if (!projectId) {
        return res.status(400).json(new ApiError(400, 'Project ID is required'));
    }

    // Fetch the project by ID
    const project = await Project.findById(projectId);

    if (!project) {
        return res.status(404).json(new ApiError(404, 'Project not found'));
    }

    return res
        .status(200)
        .json(new ApiResponse(200, 'Project fetched successfully', { project: project }));
});

/**
 * Get a specific project entry by its slug
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} 200 - Project entry
 */
const getProjectBySlug = asyncHandler(async (req, res) => {
    const { slug } = req.params;

    // Validate slug
    if (!slug) {
        return res.status(400).json(new ApiError(400, 'Project slug is required'));
    }

    // Fetch the project by slug
    const project = await Project.findOne({ slug });

    if (!project) {
        return res.status(404).json(new ApiError(404, 'Project not found'));
    }

    return res
        .status(200)
        .json(new ApiResponse(200, 'Project fetched successfully', { project: project }));
});

/**
 * Update a project entry by its ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} 200 - Updated project entry
 */
const updateProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const title = req.body?.title?.trim();
    const slug = req.body?.slug?.trim();
    const description = req.body?.description?.trim();
    const commaSeparatedTechStack = req.body?.techStack?.trim();
    const video = req.body?.video?.trim();
    const liveLink = req.body?.liveLink?.trim();
    const repoLink = req.body?.repoLink?.trim();
    const commaSeparatedTags = req.body?.tags?.trim();
    const featured = req.body?.featured;

    // Parse tech stack and tags from comma-separated strings
    const techStack = commaSeparatedTechStack
        ? commaSeparatedTechStack.split(',').map((item) => item.trim())
        : [];
    const tags = commaSeparatedTags ? commaSeparatedTags.split(',').map((item) => item.trim()) : [];

    if (
        !projectId ||
        !title ||
        !slug ||
        !description ||
        !techStack.length ||
        !repoLink ||
        !tags.length
    ) {
        return res.status(400).json(new ApiError(400, 'All fields are required'));
    }

    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
        return res.status(404).json(new ApiError(404, 'Project not found'));
    }

    // Only allow the user themselves or an admin to update
    if (project.userId.toString() !== req.user._id.toString() && !req.user.isAdmin) {
        return res
            .status(403)
            .json(new ApiError(403, 'You are not authorized to update this project'));
    }

    // Prevent duplicate project slug
    if (await Project.exists({ slug, _id: { $ne: projectId } })) {
        return res.status(409).json(new ApiError(409, 'Project with this slug already exists'));
    }

    const oldImageUrl = project.image;

    // Handle thumbnail upload if provided
    let imageUrl = '';
    if (req.files?.image?.length > 0) {
        const image = req.files.image[0];
        const uploadResult = await uploadOnCloudinary(image.path);
        imageUrl = uploadResult?.url;
    }

    // Update the project
    const updatedProject = await Project.findByIdAndUpdate(
        projectId,
        {
            title,
            slug,
            description,
            techStack,
            video: video || project.video,
            liveLink: liveLink || project.liveLink,
            repoLink,
            tags,
            featured: featured || project.featured,
            image: imageUrl || oldImageUrl,
        },
        { new: true },
    );

    if (!updatedProject) {
        return res.status(500).json(new ApiError(500, 'Failed to update project'));
    }

    if (imageUrl && oldImageUrl && oldImageUrl.includes('cloudinary.com')) {
        // Delete old image from Cloudinary if a new one is uploaded
        await deleteFromCloudinary(oldImageUrl);
    }

    return res
        .status(200)
        .json(new ApiResponse(200, 'Project updated successfully', { project: updatedProject }));
});

/**
 * Delete a project entry by its ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} 200 - Deletion result
 */
const deleteProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;

    // Validate projectId
    if (!projectId) {
        return res.status(400).json(new ApiError(400, 'Project ID is required'));
    }

    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
        return res.status(404).json(new ApiError(404, 'Project not found'));
    }

    // Only allow the user themselves
    if (project.userId.toString() !== req.user._id.toString()) {
        return res
            .status(403)
            .json(new ApiError(403, 'You are not authorized to delete this project'));
    }

    // Delete the project
    const deletedProject = await Project.findByIdAndDelete(projectId);

    if (!deletedProject) {
        return res.status(500).json(new ApiError(500, 'Failed to delete project'));
    }

    // Delete image from Cloudinary if it exists
    if (project.image && project.image.includes('cloudinary.com')) {
        await deleteFromCloudinary(project.image);
    }

    return res
        .status(200)
        .json(new ApiResponse(200, 'Project deleted successfully', { project: deletedProject }));
});

export {
    createProject,
    getProjectsByUserId,
    getProjectByProjectId,
    updateProject,
    deleteProject,
    getProjectBySlug,
};
