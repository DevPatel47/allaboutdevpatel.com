import { Router } from 'express';
import {
    createSocialLink,
    getSocialLinksByUserId,
    getSocialLinkById,
    updateSocialLink,
    deleteSocialLink,
} from '../../controllers/portfolio/sociallink.controller.js';
import { verifyJWT } from '../../middlewares/auth.middleware.js';
import { verifyAdminStatus } from '../../middlewares/checkAdminStatus.middleware.js';
import { verifyObjectId } from '../../middlewares/checkObjectId.middleware.js';

/**
 * SocialLink Routes
 * Handles CRUD operations for social link entries.
 * @module routes/portfolio/sociallink
 */

/**
 * Express router for social link endpoints
 */
const router = Router();

/**
 * Create a new social link entry for a user
 * @route POST /:userId
 * @param {string} userId - User ID (in URL path)
 * @middleware verifyJWT, verifyAdminStatus, verifyObjectId
 * @returns {Object} 201 - Created social link entry
 */
router.post('/:userId', verifyJWT, verifyAdminStatus, verifyObjectId, createSocialLink);

/**
 * Get all social link entries for a user
 * @route GET /byuserid/:userId
 * @param {string} userId - User ID (in URL path)
 * @middleware verifyObjectId
 * @returns {Object[]} 200 - List of social link entries
 */
router.get('/byuserid/:userId', verifyObjectId, getSocialLinksByUserId);

/**
 * Get a specific social link entry by its ID
 * @route GET /bysociallinkid/:socialLinkId
 * @param {string} socialLinkId - Social link entry ID (in URL path)
 * @middleware verifyObjectId
 * @returns {Object} 200 - Social link entry
 */
router.get('/bysociallinkid/:socialLinkId', verifyObjectId, getSocialLinkById);

/**
 * Update a social link entry by its ID
 * @route PUT /:socialLinkId
 * @param {string} socialLinkId - Social link entry ID (in URL path)
 * @middleware verifyJWT, verifyAdminStatus, verifyObjectId
 * @returns {Object} 200 - Updated social link entry
 */
router.put('/:socialLinkId', verifyJWT, verifyAdminStatus, verifyObjectId, updateSocialLink);

/**
 * Delete a social link entry by its ID
 * @route DELETE /:socialLinkId
 * @param {string} socialLinkId - Social link entry ID (in URL path)
 * @middleware verifyJWT, verifyAdminStatus, verifyObjectId
 * @returns {Object} 200 - Deletion result
 */
router.delete('/:socialLinkId', verifyJWT, verifyAdminStatus, verifyObjectId, deleteSocialLink);

/**
 * Exports the social link router
 */
export default router;
