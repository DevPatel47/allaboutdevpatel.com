import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiError } from '../../utils/ApiError.js';
import User from '../../models/common/user.model.js';
import { uploadOnCloudinary, deleteFromCloudinary } from '../../utils/cloudinary.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import jwt from 'jsonwebtoken';

/**
 * Generates access and refresh tokens for a user and saves the refresh token.
 * @param {string} userId - The user's MongoDB ObjectId.
 * @returns {Promise<{accessToken: string, refreshToken: string}>}
 * @throws {ApiError} If user is not found.
 */
const generateAccessAndRefereshTokens = async (userId) => {
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, 'User not found');
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
};

/**
 * Retrieve all users (admin only).
 * GET /api/users/retrieve
 */
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password -refreshToken');
    if (!users || users.length === 0) {
        return res.status(404).json(new ApiError(404, 'No users found'));
    }
    return res.status(200).json(new ApiResponse(200, 'Users retrieved successfully', { users }));
});

/**
 * Retrieve a user by ID (admin only).
 * GET /api/users/retrieve/:userId
 */
const getUserById = asyncHandler(async (req, res) => {
    const userId = req.params.userId;
    if (!userId) {
        return res.status(400).json(new ApiError(400, 'User ID is required'));
    }
    const user = await User.findById(userId).select('-password -refreshToken');
    if (!user) {
        return res.status(404).json(new ApiError(404, 'User not found'));
    }
    return res.status(200).json(new ApiResponse(200, 'User retrieved successfully', { user }));
});

/**
 * Register a new user.
 * POST /api/users/register
 */
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res
            .status(400)
            .json(new ApiError(400, 'Username, email, and password are required'));
    }
    const existedUser = await User.findOne({
        $or: [{ username }, { email: email.toLowerCase() }],
    });
    if (existedUser) {
        return res
            .status(409)
            .json(new ApiError(409, 'User with this username or email already exists'));
    }
    let profileImageUrl = '';
    if (req.files && Array.isArray(req.files.profileImage) && req.files.profileImage.length > 0) {
        const profileImage = req.files.profileImage[0];
        const uploadResult = await uploadOnCloudinary(profileImage.path);
        profileImageUrl = uploadResult?.url;
    }
    const newUser = await User.create({
        username,
        email: email.toLowerCase(),
        password,
        profileImage: profileImageUrl,
        role: 'user',
    });
    const savedUser = await User.findById(newUser._id).select('-password -refreshToken');
    if (!savedUser) {
        return res.status(500).json(new ApiError(500, 'Failed to create user'));
    }
    return res
        .status(201)
        .json(new ApiResponse(201, 'User registered successfully', { user: savedUser }));
});

/**
 * Update user profile (partial update allowed).
 * PATCH /api/users/update/:userId
 */
const updateUser = asyncHandler(async (req, res) => {
    const userId = req.params.userId;
    if (!userId) {
        return res.status(400).json(new ApiError(400, 'User ID is required'));
    }
    const { username, email } = req.body;
    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email.toLowerCase();

    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json(new ApiError(404, 'User not found'));
    }

    // Check for username/email uniqueness (excluding current user)
    if (username || email) {
        const existedUser = await User.findOne({
            $or: [
                ...(username ? [{ username }] : []),
                ...(email ? [{ email: email.toLowerCase() }] : []),
            ],
            _id: { $ne: userId },
        });
        if (existedUser) {
            return res
                .status(409)
                .json(new ApiError(409, 'User with this username or email already exists'));
        }
    }

    const oldProfileImageUrl = user.profileImage;
    let profileImageUrl = '';
    if (req.files && Array.isArray(req.files.profileImage) && req.files.profileImage.length > 0) {
        const profileImage = req.files.profileImage[0];
        const uploadResult = await uploadOnCloudinary(profileImage.path);
        profileImageUrl = uploadResult?.url;
    }

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
            ...updateData,
            profileImage: profileImageUrl || oldProfileImageUrl,
        },
        { new: true },
    ).select('-password -refreshToken');

    if (!updatedUser) {
        return res.status(500).json(new ApiError(500, 'Failed to update user'));
    }

    // Delete old image from Cloudinary if a new one was uploaded and the old one was on Cloudinary
    if (profileImageUrl && oldProfileImageUrl && oldProfileImageUrl.includes('cloudinary.com')) {
        await deleteFromCloudinary(oldProfileImageUrl);
    }

    return res
        .status(200)
        .json(new ApiResponse(200, 'User updated successfully', { user: updatedUser }));
});

/**
 * Change the current user's password.
 * PATCH /api/users/change-password
 */
const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
        return res.status(400).json(new ApiError(400, 'Current and new password are required'));
    }
    const user = await User.findById(req.user?._id);
    if (!user) {
        return res.status(404).json(new ApiError(404, 'User not found'));
    }
    const isPasswordCorrect = await user.isPasswordCorrect(currentPassword);
    if (!isPasswordCorrect) {
        return res.status(401).json(new ApiError(401, 'Current password is incorrect'));
    }
    user.password = newPassword;
    await user.save({ validateBeforeSave: false });
    const updatedUser = await User.findById(user._id).select('-password -refreshToken');
    if (!updatedUser) {
        return res.status(500).json(new ApiError(500, 'Failed to update password'));
    }
    return res
        .status(200)
        .json(new ApiResponse(200, 'Password updated successfully', { user: updatedUser }));
});

/**
 * Delete a user by ID (admin only).
 * DELETE /api/users/delete/:userId
 */
const deleteUser = asyncHandler(async (req, res) => {
    const userId = req.params.userId;
    if (!userId) {
        return res.status(400).json(new ApiError(400, 'User ID is required'));
    }
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json(new ApiError(404, 'User not found'));
    }
    if (user.profileImage && user.profileImage.includes('cloudinary.com')) {
        await deleteFromCloudinary(user.profileImage);
    }
    const deletedUser = await User.findByIdAndDelete(userId).select('-password -refreshToken');
    if (!deletedUser) {
        return res.status(500).json(new ApiError(500, 'Failed to delete user'));
    }
    return res
        .status(200)
        .json(new ApiResponse(200, 'User deleted successfully', { user: deletedUser }));
});

/**
 * Delete the current authenticated user.
 * DELETE /api/users/delete
 */
const deleteCurrentUser = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    if (!userId) {
        return res.status(400).json(new ApiError(400, 'User ID is required'));
    }
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json(new ApiError(404, 'User not found'));
    }
    if (user.profileImage && user.profileImage.includes('cloudinary.com')) {
        await deleteFromCloudinary(user.profileImage);
    }
    const deletedUser = await User.findByIdAndDelete(userId).select('-password -refreshToken');
    if (!deletedUser) {
        return res.status(500).json(new ApiError(500, 'Failed to delete user'));
    }
    return res
        .status(200)
        .json(new ApiResponse(200, 'User deleted successfully', { user: deletedUser }));
});

/**
 * User login with username or email and password.
 * POST /api/users/login
 */
const loginUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    if ((!username && !email) || !password) {
        return res
            .status(400)
            .json(new ApiError(400, 'Username or email and password are required'));
    }
    const user = await User.findOne({
        $or: [
            ...(username ? [{ username }] : []),
            ...(email ? [{ email: email?.toLowerCase() }] : []),
        ],
    });
    if (!user || !(await user.isPasswordCorrect(password))) {
        return res.status(401).json(new ApiError(401, 'Invalid username/email or password'));
    }
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);
    const loggedInUser = await User.findById(user._id).select('-password -refreshToken');
    const options = {
        httpOnly: true,
        secure: true,
    };
    return res
        .status(200)
        .cookie('accessToken', accessToken, options)
        .cookie('refreshToken', refreshToken, options)
        .json(
            new ApiResponse(200, 'User logged in successfully', {
                user: loggedInUser,
                accessToken,
                refreshToken,
            }),
        );
});

/**
 * User logout and clear refresh token.
 * POST /api/users/logout
 */
const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        { $set: { refreshToken: undefined } },
        { new: true },
    );
    const options = {
        httpOnly: true,
        secure: true,
    };
    return res
        .status(200)
        .cookie('accessToken', '', options)
        .cookie('refreshToken', '', options)
        .json(new ApiResponse(200, 'User logged out successfully'));
});

/**
 * Refresh access token using refresh token.
 * POST /api/users/refresh-token
 */
const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) {
        return res.status(400).json(new ApiError(400, 'Refresh token is required'));
    }
    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decodedToken._id);
        if (!user || user.refreshToken !== incomingRefreshToken) {
            return res.status(401).json(new ApiError(401, 'Invalid refresh token'));
        }
        const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);
        const options = {
            httpOnly: true,
            secure: true,
        };
        return res
            .status(200)
            .cookie('accessToken', accessToken, options)
            .cookie('refreshToken', refreshToken, options)
            .json(
                new ApiResponse(200, 'Access token refreshed successfully', {
                    accessToken,
                    refreshToken,
                }),
            );
    } catch (error) {
        return res.status(401).json(new ApiError(401, 'Invalid refresh token'));
    }
});

/**
 * Get current authenticated user.
 * GET /api/users/current-user
 */
const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200).json(
        new ApiResponse(200, 'Current user retrieved successfully', {
            user: req.user,
        }),
    );
});

/**
 * Update a user's role (admin only).
 * PATCH /api/users/update-role/:userId
 */
const updateRole = asyncHandler(async (req, res) => {
    const userId = req.params.userId;
    if (!userId) {
        return res.status(400).json(new ApiError(400, 'User ID is required'));
    }
    const { role } = req.body;
    if (!role || !['admin', 'user'].includes(role)) {
        return res.status(400).json(new ApiError(400, 'Role must be either "admin" or "user"'));
    }
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json(new ApiError(404, 'User not found'));
    }
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: { role } },
        { new: true },
    ).select('-password -refreshToken');
    if (!updatedUser) {
        return res.status(500).json(new ApiError(500, 'Failed to update user role'));
    }
    return res.status(200).json(
        new ApiResponse(200, 'User role updated successfully', {
            user: updatedUser,
        }),
    );
});

// Export controller functions
export {
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
};
