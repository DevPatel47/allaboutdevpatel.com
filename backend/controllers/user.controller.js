import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import User from '../models/user.model.js';
import { uploadOnCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';
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

  // Save refresh token to user document
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

/**
 * @desc    Retrieve all users (admin only)
 * @route   GET /api/users/retrieve
 * @access  Private (Admin)
 */
const getAllUsers = asyncHandler(async (req, res) => {
  // Fetch all users, excluding password and refreshToken fields
  const users = await User.find().select('-password -refreshToken');
  if (!users || users.length === 0) {
    return res.status(404).json(new ApiError(404, 'No users found'));
  }
  return res.status(200).json(new ApiResponse(200, 'Users retrieved successfully', { users }));
});

/**
 * @desc    Retrieve a user by ID (admin only)
 * @route   GET /api/users/retrieve/:userId
 * @access  Private (Admin)
 */
const getUserById = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  if (!userId) {
    return res.status(400).json(new ApiError(400, 'User ID is required'));
  }

  // Find user by ID, exclude password and refreshToken
  const user = await User.findById(userId).select('-password -refreshToken');

  if (!user) {
    return res.status(404).json(new ApiError(404, 'User not found'));
  }

  return res.status(200).json(new ApiResponse(200, 'User retrieved successfully', { user }));
});

/**
 * @desc    Register a new user
 * @route   POST /api/users/register
 * @access  Public
 */
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // Validate required fields
  if (!username || !email || !password) {
    return res.status(400).json(new ApiError(400, 'Username, email, and password are required'));
  }

  // Check for existing user with same username or email
  const existedUser = await User.findOne({
    $or: [{ username }, { email: email.toLowerCase() }],
  });

  if (existedUser) {
    return res
      .status(409)
      .json(new ApiError(409, 'User with this username or email already exists'));
  }

  // Handle profile image upload if provided
  let profileImageUrl = '';
  if (req.files && Array.isArray(req.files.profileImage) && req.files.profileImage.length > 0) {
    const profileImage = req.files.profileImage[0];
    const uploadResult = await uploadOnCloudinary(profileImage.path);
    profileImageUrl = uploadResult?.url;
  }

  // Create new user
  const newUser = await User.create({
    username,
    email: email.toLowerCase(),
    password,
    profileImage: profileImageUrl,
    role: 'user',
  });

  // Fetch saved user without sensitive fields
  const savedUser = await User.findById(newUser._id).select('-password -refreshToken');

  if (!savedUser) {
    return res.status(500).json(new ApiError(500, 'Failed to create user'));
  }

  return res
    .status(201)
    .json(new ApiResponse(201, 'User registered successfully', { user: savedUser }));
});

/**
 * @desc    Update user profile (partial update allowed)
 * @route   PATCH /api/users/update/:userId
 * @access  Private
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

  // Find user to update
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

  // Store old profile image URL for possible deletion
  const oldProfileImageUrl = user.profileImage;

  // Handle new profile image upload if provided
  let profileImageUrl = '';
  if (req.files && Array.isArray(req.files.profileImage) && req.files.profileImage.length > 0) {
    const profileImage = req.files.profileImage[0];
    const uploadResult = await uploadOnCloudinary(profileImage.path);
    profileImageUrl = uploadResult?.url;
  }

  // Update user document
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
 * @desc    Change the current user's password
 * @route   PATCH /user/change-password
 * @access  Private
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

  return res.status(200).json(
    new ApiResponse(200, 'Password updated successfully', {
      user: updatedUser,
    }),
  );
});

/**
 * @desc    Delete a user by ID (admin only)
 * @route   DELETE /api/users/delete/:userId
 * @access  Private (Admin)
 */
const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).json(new ApiError(400, 'User ID is required'));
  }

  // Find user to delete
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json(new ApiError(404, 'User not found'));
  }

  // Delete profile image from Cloudinary if it exists and is a Cloudinary URL
  if (user.profileImage && user.profileImage.includes('cloudinary.com')) {
    await deleteFromCloudinary(user.profileImage);
  }

  // Delete user document
  const deletedUser = await User.findByIdAndDelete(userId).select('-password -refreshToken');

  if (!deletedUser) {
    return res.status(500).json(new ApiError(500, 'Failed to delete user'));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, 'User deleted successfully', { user: deletedUser }));
});

/**
 * @desc    Delete the current authenticated user
 * @route   DELETE /api/users/delete
 * @access  Private
 */
const deleteCurrentUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  if (!userId) {
    return res.status(400).json(new ApiError(400, 'User ID is required'));
  }

  // Find user to delete
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json(new ApiError(404, 'User not found'));
  }

  // Delete profile image from Cloudinary if it exists and is a Cloudinary URL
  if (user.profileImage && user.profileImage.includes('cloudinary.com')) {
    await deleteFromCloudinary(user.profileImage);
  }

  // Delete user document
  const deletedUser = await User.findByIdAndDelete(userId).select('-password -refreshToken');

  if (!deletedUser) {
    return res.status(500).json(new ApiError(500, 'Failed to delete user'));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, 'User deleted successfully', { user: deletedUser }));
});

/**
 * @desc    User login with username or email and password
 * @route   POST /api/users/login
 * @access  Public
 */
const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // Require either username or email, and password
  if ((!username && !email) || !password) {
    return res.status(400).json(new ApiError(400, 'Username or email and password are required'));
  }

  // Find user by username or email
  const user = await User.findOne({
    $or: [...(username ? [{ username }] : []), ...(email ? [{ email: email?.toLowerCase() }] : [])],
  });

  // Check password
  if (!user || !(await user.isPasswordCorrect(password))) {
    return res.status(401).json(new ApiError(401, 'Invalid username/email or password'));
  }

  // Generate tokens
  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);

  // Fetch user without sensitive fields
  const loggedInUser = await User.findById(user._id).select('-password -refreshToken');

  const options = {
    httpOnly: true,
    secure: true,
  };

  // Set tokens as cookies and return user info
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
 * @desc    User logout and clear refresh token
 * @route   POST /api/users/logout
 * @access  Private
 */
const logoutUser = asyncHandler(async (req, res) => {
  // Remove refresh token from user document
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { refreshToken: undefined },
    },
    { new: true },
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  // Clear cookies
  return res
    .status(200)
    .cookie('accessToken', '', options)
    .cookie('refreshToken', '', options)
    .json(new ApiResponse(200, 'User logged out successfully'));
});

/**
 * @desc    Refresh access token using refresh token
 * @route   POST /api/users/refresh-token
 * @access  Private
 */
const refreshAccessToken = asyncHandler(async (req, res) => {
  // Get refresh token from cookies or body
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    return res.status(400).json(new ApiError(400, 'Refresh token is required'));
  }

  try {
    // Verify refresh token
    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Find user by decoded token
    const user = await User.findById(decodedToken._id);

    // Check if refresh token matches
    if (!user || user.refreshToken !== incomingRefreshToken) {
      return res.status(401).json(new ApiError(401, 'Invalid refresh token'));
    }

    // Generate new tokens
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);

    const options = {
      httpOnly: true,
      secure: true,
    };

    // Set new tokens as cookies
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
 * @desc    Get current authenticated user
 * @route   GET /api/users/current-user
 * @access  Private
 */
const getCurrentUser = asyncHandler(async (req, res) => {
  // Return user info from request (set by auth middleware)
  return res.status(200).json(
    new ApiResponse(200, 'Current user retrieved successfully', {
      user: req.user,
    }),
  );
});

/**
 * @desc    Update a user's role (admin only)
 * @route   PATCH /api/users/update-role/:userId
 * @access  Private (Admin)
 */
const updateRole = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  if (!userId) {
    return res.status(400).json(new ApiError(400, 'User ID is required'));
  }

  const { role } = req.body;

  // Validate role value
  if (!role || !['admin', 'user'].includes(role)) {
    return res.status(400).json(new ApiError(400, 'Role must be either "admin" or "user"'));
  }

  // Find user to update
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json(new ApiError(404, 'User not found'));
  }

  // Update role
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
