import { Router } from 'express';
import {
    createProject,
    getProjectsByUserId,
    getProjectByProjectId,
    getProjectBySlug,
    updateProject,
    deleteProject,
} from '../../controllers/portfolio/project.controller.js';
import { verifyJWT } from '../../middlewares/auth.middleware.js';
import { verifyAdminStatus } from '../../middlewares/checkAdminStatus.middleware.js';
import { upload } from '../../middlewares/multer.middleware.js';
import { verifyObjectId } from '../../middlewares/checkObjectId.middleware.js';

/**
 * Project Routes
 * Handles CRUD operations for project entries.
 * @module routes/portfolio/project
 */

/**
 * Express router for project endpoints
 */
const router = Router();

/**
 * Create a new project entry for a user
 * @route POST /:userId
 * @param {string} userId - User ID (in URL path)
 * @middleware verifyJWT, verifyAdminStatus, upload.single (image), verifyObjectId
 * @returns {Object} 201 - Created project entry
 */
router.post(
    '/:userId',
    verifyJWT,
    verifyAdminStatus,
    upload.fields([{ name: 'image', maxCount: 1 }]),
    verifyObjectId,
    createProject,
);

/**
 * Get all project entries for a user
 * @route GET /byuserid/:userId
 * @param {string} userId - User ID (in URL path)
 * @middleware verifyObjectId
 * @returns {Object[]} 200 - List of project entries
 */
router.get('/byuserid/:userId', verifyObjectId, getProjectsByUserId);

/**
 * Get a specific project entry by its ID
 * @route GET /byprojectid/:projectId
 * @param {string} projectId - Project entry ID (in URL path)
 * @middleware verifyObjectId
 * @returns {Object} 200 - Project entry
 */
router.get('/byprojectid/:projectId', verifyObjectId, getProjectByProjectId);

/**
 * Get a specific project entry by its slug
 * @route GET /byslug/:slug
 * @param {string} slug - Project slug (in URL path)
 * @returns {Object} 200 - Project entry
 */
router.get('/byslug/:slug', getProjectBySlug);

/**
 * Update a project entry by its ID
 * @route PUT /:projectId
 * @param {string} projectId - Project entry ID (in URL path)
 * @middleware verifyJWT, verifyAdminStatus, upload.single (image), verifyObjectId
 * @returns {Object} 200 - Updated project entry
 */
router.put(
    '/:projectId',
    verifyJWT,
    verifyAdminStatus,
    upload.fields([{ name: 'image', maxCount: 1 }]),
    verifyObjectId,
    updateProject,
);

/**
 * Delete a project entry by its ID
 * @route DELETE /:projectId
 * @param {string} projectId - Project entry ID (in URL path)
 * @middleware verifyJWT, verifyAdminStatus, verifyObjectId
 * @returns {Object} 200 - Deletion result
 */
router.delete('/:projectId', verifyJWT, verifyAdminStatus, verifyObjectId, deleteProject);

export default router;
