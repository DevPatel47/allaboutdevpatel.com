import { Router } from 'express';
import {
    createCertification,
    getCertificationsByUserId,
    getCertificationByCertId,
    updateCertification,
    deleteCertification,
} from '../../controllers/portfolio/certification.controller.js';
import { verifyJWT } from '../../middlewares/auth.middleware.js';
import { verifyAdminStatus } from '../../middlewares/checkAdminStatus.middleware.js';
import { upload } from '../../middlewares/multer.middleware.js';
import { verifyObjectId } from '../../middlewares/checkObjectId.middleware.js';

/**
 * Certification Routes
 * Handles CRUD operations for certification entries.
 * @module routes/portfolio/certification
 */

/**
 * Express router for certification endpoints
 */
const router = Router();

/**
 * Create a new certification entry for a user
 * @route POST /:userId
 * @param {string} userId - User ID (in URL path)
 * @middleware verifyJWT, verifyAdminStatus, upload.fields (badgeImage), verifyObjectId
 * @returns {Object} 201 - Created certification entry
 */
router.post(
    '/:userId',
    verifyJWT,
    verifyAdminStatus,
    upload.fields([{ name: 'badgeImage', maxCount: 1 }]),
    verifyObjectId,
    createCertification,
);

/**
 * Get all certification entries for a user
 * @route GET /byuserid/:userId
 * @param {string} userId - User ID (in URL path)
 * @middleware verifyObjectId
 * @returns {Object[]} 200 - List of certification entries
 */
router.get('/byuserid/:userId', verifyObjectId, getCertificationsByUserId);

/**
 * Get a specific certification entry by its ID
 * @route GET /bycertificationid/:certificationId
 * @param {string} certificationId - Certification entry ID (in URL path)
 * @middleware verifyObjectId
 * @returns {Object} 200 - Certification entry
 */
router.get('/bycertificationid/:certificationId', verifyObjectId, getCertificationByCertId);

/**
 * Update a certification entry by its ID
 * @route PUT /:certificationId
 * @param {string} certificationId - Certification entry ID (in URL path)
 * @middleware verifyJWT, verifyAdminStatus, upload.fields (badgeImage), verifyObjectId
 * @returns {Object} 200 - Updated certification entry
 */
router.put(
    '/:certificationId',
    verifyJWT,
    verifyAdminStatus,
    upload.fields([{ name: 'badgeImage', maxCount: 1 }]),
    verifyObjectId,
    updateCertification,
);

/**
 * Delete a certification entry by its ID
 * @route DELETE /:certificationId
 * @param {string} certificationId - Certification entry ID (in URL path)
 * @middleware verifyJWT, verifyAdminStatus, verifyObjectId
 * @returns {Object} 200 - Deletion result
 */
router.delete(
    '/:certificationId',
    verifyJWT,
    verifyAdminStatus,
    verifyObjectId,
    deleteCertification,
);

/**
 * Exports the certification router
 */
export default router;
