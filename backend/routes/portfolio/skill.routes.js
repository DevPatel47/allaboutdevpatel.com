import { Router } from 'express';
import {
    createSkill,
    getSkillsByUserId,
    getSkillBySkillId,
    updateSkill,
    deleteSkill,
} from '../../controllers/portfolio/skill.controller.js';
import { verifyJWT } from '../../middlewares/auth.middleware.js';
import { verifyAdminStatus } from '../../middlewares/checkAdminStatus.middleware.js';
import { upload } from '../../middlewares/multer.middleware.js';
import { verifyObjectId } from '../../middlewares/checkObjectId.middleware.js';

/**
 * Skill Routes
 * Handles CRUD operations for skill entries.
 * @module routes/portfolio/skill
 */

/**
 * Express router for skill endpoints
 */
const router = Router();

/**
 * Create a new skill entry for a user
 * @route POST /:userId
 * @param {string} userId - User ID (in URL path)
 * @middleware verifyJWT, verifyAdminStatus, verifyObjectId
 * @returns {Object} 201 - Created skill entry
 */
router.post('/:userId', verifyJWT, verifyAdminStatus, verifyObjectId, createSkill);

/**
 * Get all skill entries for a user
 * @route GET /byuserid/:userId
 * @param {string} userId - User ID (in URL path)
 * @middleware verifyObjectId
 * @returns {Object[]} 200 - List of skill entries
 */
router.get('/byuserid/:userId', verifyObjectId, getSkillsByUserId);

/**
 * Get a specific skill entry by its ID
 * @route GET /byskillid/:skillId
 * @param {string} skillId - Skill entry ID (in URL path)
 * @middleware verifyObjectId
 * @returns {Object} 200 - Skill entry
 */
router.get('/byskillid/:skillId', verifyObjectId, getSkillBySkillId);

/**
 * Update a skill entry by its ID
 * @route PUT /:skillId
 * @param {string} skillId - Skill entry ID (in URL path)
 * @middleware verifyJWT, verifyAdminStatus, verifyObjectId
 * @returns {Object} 200 - Updated skill entry
 */
router.put('/:skillId', verifyJWT, verifyAdminStatus, verifyObjectId, updateSkill);

/**
 * Delete a skill entry by its ID
 * @route DELETE /:skillId
 * @param {string} skillId - Skill entry ID (in URL path)
 * @middleware verifyJWT, verifyAdminStatus, verifyObjectId
 * @returns {Object} 200 - Deletion result
 */
router.delete('/:skillId', verifyJWT, verifyAdminStatus, verifyObjectId, deleteSkill);

/**
 * Exports the skill router
 */
export default router;
