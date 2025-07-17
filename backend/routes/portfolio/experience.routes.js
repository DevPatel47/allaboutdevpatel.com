import { Router } from 'express';
import {
    createExperience,
    getExperiencesByUserId,
    getExperienceByExpId,
    updateExperience,
    deleteExperience,
} from '../../controllers/portfolio/experience.controller.js';
import { verifyJWT } from '../../middlewares/auth.middleware.js';
import { verifyAdminStatus } from '../../middlewares/checkAdminStatus.middleware.js';
import { upload } from '../../middlewares/multer.middleware.js';
import { verifyObjectId } from '../../middlewares/checkObjectId.middleware.js';

/**
 * Experience Routes
 * Handles CRUD operations for experience entries.
 * @module routes/portfolio/experience
 */

/**
 * Express router for experience endpoints
 */
const router = Router();

/**
 * Create a new experience entry for a user
 * @route POST /:userId
 * @param {string} userId - User ID (in URL path)
 * @middleware verifyJWT, verifyAdminStatus, upload.fields (logo)
 * @returns {Object} 201 - Created experience entry
 */
router.post(
    '/:userId',
    verifyJWT,
    verifyAdminStatus,
    upload.fields([{ name: 'logo', maxCount: 1 }]),
    verifyObjectId,
    createExperience,
);

/**
 * Get all experience entries for a user
 * @route GET /byuserid/:userId
 * @param {string} userId - User ID (in URL path)
 * @returns {Object[]} 200 - List of experience entries
 */
router.get('/byuserid/:userId', verifyObjectId, getExperiencesByUserId);

/**
 * Get a specific experience entry by its ID
 * @route GET /byexperienceid/:experienceId
 * @param {string} experienceId - Experience entry ID (in URL path)
 * @returns {Object} 200 - Experience entry
 */
router.get('/byexperienceid/:experienceId', verifyObjectId, getExperienceByExpId);

/**
 * Update an experience entry by its ID
 * @route PUT /:experienceId
 * @param {string} experienceId - Experience entry ID (in URL path)
 * @middleware verifyJWT, verifyAdminStatus, upload.fields (logo)
 * @returns {Object} 200 - Updated experience entry
 */
router.put(
    '/:experienceId',
    verifyJWT,
    verifyAdminStatus,
    upload.fields([{ name: 'logo', maxCount: 1 }]),
    verifyObjectId,
    updateExperience,
);

/**
 * Delete an experience entry by its ID
 * @route DELETE /:experienceId
 * @param {string} experienceId - Experience entry ID (in URL path)
 * @middleware verifyJWT, verifyAdminStatus
 * @returns {Object} 200 - Deletion result
 */
router.delete('/:experienceId', verifyJWT, verifyAdminStatus, verifyObjectId, deleteExperience);

/**
 * Exports the experience router
 */
export default router;
