import { Router } from 'express';
import {
    getAllUsers,
    getUserById,
    registerUser,
    updateUser,
    changeCurrentPassword,
    deleteUser,
    deleteCurrentUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getCurrentUser,
    updateRole,
} from '../../controllers/common/user.controller.js';
import { upload } from '../../middlewares/multer.middleware.js';
import { verifyJWT } from '../../middlewares/auth.middleware.js';
import { verifyAdminStatus } from '../../middlewares/checkAdminStatus.middleware.js';

const router = Router();

/**
 * Get all users (admin only).
 * @route   GET /api/v1/users/retrieve
 * @desc    Retrieve all users. Only accessible by admin.
 * @access  Private
 */
router.route('/retrieve').get(verifyJWT, verifyAdminStatus, getAllUsers);

/**
 * Get a user by ID (admin only).
 * @route   GET /api/v1/users/retrieve/:userId
 * @desc    Retrieve a user by their ID. Only accessible by admin.
 * @access  Private
 */
router.route('/retrieve/:userId').get(verifyJWT, verifyAdminStatus, getUserById);

/**
 * Register a new user.
 * @route   POST /api/v1/users/register
 * @desc    Register a new user. Public route.
 * @access  Public
 */
router.route('/register').post(
    upload.fields([
        {
            name: 'profileImage',
            maxCount: 1,
        },
    ]),
    registerUser,
);

/**
 * Update user profile (authenticated user).
 * @route   PATCH /api/v1/users/update/:userId
 * @desc    Update user profile. Only accessible by the user themselves.
 * @access  Private
 */
router.route('/update/:userId').patch(
    verifyJWT,
    upload.fields([
        {
            name: 'profileImage',
            maxCount: 1,
        },
    ]),
    updateUser,
);

/**
 * Change the current user's password.
 * @route   PATCH /api/v1/users/change-password
 * @desc    Change the password of the current authenticated user.
 * @access  Private
 */
router.route('/change-password').patch(verifyJWT, changeCurrentPassword);

/**
 * Delete a user by ID (admin only).
 * @route   DELETE /api/v1/users/delete/:userId
 * @desc    Delete a user by their ID. Only accessible by admin.
 * @access  Private
 */
router.route('/delete/:userId').delete(verifyJWT, verifyAdminStatus, deleteUser);

/**
 * Delete the current authenticated user.
 * @route   DELETE /api/v1/users/delete
 * @desc    Delete the current authenticated user.
 * @access  Private
 */
router.route('/delete').delete(verifyJWT, deleteCurrentUser);

/**
 * User login.
 * @route   POST /api/v1/users/login
 * @desc    Login a user. Public route.
 * @access  Public
 */
router.route('/login').post(loginUser);

/**
 * User logout.
 * @route   POST /api/v1/users/logout
 * @desc    Logout the current authenticated user.
 * @access  Private
 */
router.route('/logout').post(verifyJWT, logoutUser);

/**
 * Refresh access token.
 * @route   POST /api/v1/users/refresh-token
 * @desc    Refresh the access token using a refresh token.
 * @access  Private
 */
router.route('/refresh-token').post(verifyJWT, refreshAccessToken);

/**
 * Get current authenticated user.
 * @route   GET /api/v1/users/current-user
 * @desc    Get details of the current authenticated user.
 * @access  Private
 */
router.route('/current-user').get(verifyJWT, getCurrentUser);

/**
 * Update a user's role (admin only).
 * @route   PATCH /api/v1/users/update-role/:userId
 * @desc    Update a user's role (admin/user). Only accessible by admin.
 * @access  Private
 */
router.route('/update-role/:userId').patch(verifyJWT, verifyAdminStatus, updateRole);

export default router;
