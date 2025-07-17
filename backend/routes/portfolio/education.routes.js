import { Router } from 'express';
import {
    createEducation,
    getEducationsByUserId,
    getEducationByEduId,
    updateEducation,
    deleteEducation,
} from '../../controllers/portfolio/education.controller.js';
import { verifyJWT } from '../../middlewares/auth.middleware.js';
import { verifyAdminStatus } from '../../middlewares/checkAdminStatus.middleware.js';
import { upload } from '../../middlewares/multer.middleware.js';
import { verifyObjectId } from '../../middlewares/checkObjectId.middleware.js';

/**
 * Education Routes
 * Handles CRUD operations for education entries.
 * @module routes/portfolio/education
 */

/**
 * Express router for education endpoints
 */
const router = Router();

/**
 * Create a new education entry for a user
 * @route POST /:userId
 * @param {string} userId - User ID (in URL path)
 * @middleware verifyJWT, verifyAdminStatus, upload.fields (logo)
 * @returns {Object} 201 - Created education entry
 */
router.post(
    '/:userId',
    verifyJWT,
    verifyAdminStatus,
    upload.fields([{ name: 'logo', maxCount: 1 }]),
    verifyObjectId,
    createEducation,
);

/**
 * Get all education entries for a user
 * @route GET /byuserid/:userId
 * @param {string} userId - User ID (in URL path)
 * @returns {Object[]} 200 - List of education entries
 */
router.get('/byuserid/:userId', verifyObjectId, getEducationsByUserId);

/**
 * Get a specific education entry by its ID
 * @route GET /byeducationid/:educationId
 * @param {string} educationId - Education entry ID (in URL path)
 * @returns {Object} 200 - Education entry
 */
router.get('/byeducationid/:educationId', verifyObjectId, getEducationByEduId);

/**
 * Update an education entry by its ID
 * @route PUT /:educationId
 * @param {string} educationId - Education entry ID (in URL path)
 * @middleware verifyJWT, verifyAdminStatus, upload.fields (logo)
 * @returns {Object} 200 - Updated education entry
 */
router.put(
    '/:educationId',
    verifyJWT,
    verifyAdminStatus,
    upload.fields([{ name: 'logo', maxCount: 1 }]),
    verifyObjectId,
    updateEducation,
);

/**
 * Delete an education entry by its ID
 * @route DELETE /:educationId
 * @param {string} educationId - Education entry ID (in URL path)
 * @middleware verifyJWT, verifyAdminStatus
 * @returns {Object} 200 - Deletion result
 */
router.delete('/:educationId', verifyJWT, verifyAdminStatus, verifyObjectId, deleteEducation);

/**
 * Exports the education router
 */
export default router;
