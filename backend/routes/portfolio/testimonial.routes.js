import { Router } from 'express';
import {
    createTestimonial,
    getTestimonialsByUserId,
    getTestimonialById,
    updateTestimonial,
    deleteTestimonial,
} from '../../controllers/portfolio/testimonial.controller.js';
import { verifyJWT } from '../../middlewares/auth.middleware.js';
import { verifyAdminStatus } from '../../middlewares/checkAdminStatus.middleware.js';
import { upload } from '../../middlewares/multer.middleware.js';
import { verifyObjectId } from '../../middlewares/checkObjectId.middleware.js';

/**
 * Testimonial Routes
 * Handles CRUD operations for testimonial entries.
 * @module routes/portfolio/testimonial
 */

/**
 * Express router for testimonial endpoints
 */
const router = Router();

/**
 * Create a new testimonial entry for a user
 * @route POST /:userId
 * @param {string} userId - User ID (in URL path)
 * @middleware verifyJWT, upload.single (image), verifyObjectId
 * @returns {Object} 201 - Created testimonial entry
 */
router.post('/:userId', verifyJWT, upload.single('image'), verifyObjectId, createTestimonial);

/**
 * Get all testimonial entries for a user
 * @route GET /byuserid/:userId
 * @param {string} userId - User ID (in URL path)
 * @middleware verifyObjectId
 * @returns {Object[]} 200 - List of testimonial entries
 */
router.get('/byuserid/:userId', verifyObjectId, getTestimonialsByUserId);

/**
 * Get a specific testimonial entry by its ID
 * @route GET /bytestimonialid/:testimonialId
 * @param {string} testimonialId - Testimonial entry ID (in URL path)
 * @middleware verifyObjectId
 * @returns {Object} 200 - Testimonial entry
 */
router.get('/bytestimonialid/:testimonialId', verifyObjectId, getTestimonialById);

/**
 * Update a testimonial entry by its ID
 * @route PUT /:testimonialId
 * @param {string} testimonialId - Testimonial entry ID (in URL path)
 * @middleware verifyJWT, upload.single (image), verifyObjectId
 * @returns {Object} 200 - Updated testimonial entry
 */
router.put('/:testimonialId', verifyJWT, upload.single('image'), verifyObjectId, updateTestimonial);

/**
 * Delete a testimonial entry by its ID
 * @route DELETE /:testimonialId
 * @param {string} testimonialId - Testimonial entry ID (in URL path)
 * @middleware verifyJWT, verifyObjectId
 * @returns {Object} 200 - Deletion result
 */
router.delete('/:testimonialId', verifyJWT, verifyObjectId, deleteTestimonial);

/**
 * Exports the testimonial router
 */
export default router;
