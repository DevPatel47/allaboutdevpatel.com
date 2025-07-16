import { Router } from 'express';
import {
    createIntroduction,
    getIntroduction,
    updateIntroduction,
    deleteIntroduction,
} from '../../controllers/portfolio/introduction.controller.js';
import { verifyJWT } from '../../middlewares/auth.middleware.js';
import { upload } from '../../middlewares/multer.middleware.js';
import { verifyAdminStatus } from '../../middlewares/checkAdminStatus.middleware.js';

const router = Router();

/**
 * Creates a new introduction for a user.
 * Only the user themselves or an admin can perform this action.
 * @route   POST /api/v1/portfolio/introductions/:userId
 * @desc    Create a new introduction for a user (protected, only self/admin)
 * @access  Private
 */
router.post(
    '/:userId',
    verifyJWT,
    verifyAdminStatus,
    upload.fields([
        { name: 'profileImage', maxCount: 1 },
        { name: 'resume', maxCount: 1 },
    ]),
    createIntroduction,
);

/**
 * Retrieves the introduction for a user.
 * @route   GET /api/v1/portfolio/introductions/:userId
 * @desc    Get the introduction for a user
 * @access  Public
 */
router.get('/:userId', getIntroduction);

/**
 * Updates the introduction for a user.
 * Only the user themselves or an admin can perform this action.
 * Allows partial updates.
 * @route   PUT /api/v1/portfolio/introductions/:userId
 * @desc    Update the introduction for a user (protected, only self/admin, partial updates allowed)
 * @access  Private
 */
router.put(
    '/:userId',
    verifyJWT,
    verifyAdminStatus,
    upload.fields([
        { name: 'profileImage', maxCount: 1 },
        { name: 'resume', maxCount: 1 },
    ]),
    updateIntroduction,
);

/**
 * Deletes the introduction for a user.
 * Only the user themselves or an admin can perform this action.
 * @route   DELETE /api/v1/portfolio/introductions/:userId
 * @desc    Delete the introduction for a user (protected, only self/admin)
 * @access  Private
 */
router.delete('/:userId', verifyJWT, verifyAdminStatus, deleteIntroduction);

export default router;
