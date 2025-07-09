import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

/**
 * User Schema
 * Defines the structure for user documents in MongoDB.
 * Includes authentication, profile, and role management fields.
 */
const userSchema = new mongoose.Schema(
  {
    /**
     * Unique username for the user.
     * @type {String}
     */
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    /**
     * Unique email address for the user.
     * @type {String}
     */
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
    },
    /**
     * Hashed password for authentication.
     * @type {String}
     */
    password: {
      type: String,
      required: true,
    },
    /**
     * Optional profile image URL.
     * @type {String}
     */
    profileImage: {
      type: String,
      default: '',
    },
    /**
     * User role: 'admin' or 'user'.
     * @type {String}
     */
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    /**
     * Refresh token for session management.
     * @type {String}
     */
    refreshToken: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }, // Automatically adds createdAt and updatedAt fields
);

/**
 * Pre-save middleware to hash the password if it has been modified.
 * Ensures passwords are always stored securely.
 */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

/**
 * Compares a given password with the user's hashed password.
 * @param {string} password - The plain text password to compare.
 * @returns {Promise<boolean>} - True if the password matches, false otherwise.
 */
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

/**
 * Generates a JWT access token for the user.
 * @returns {string} - The signed JWT access token.
 */
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      userName: this.userName,
      email: this.email,
      fullName: this.fullName,
      isAdmin: this.isAdmin,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    },
  );
};

/**
 * Generates a JWT refresh token for the user.
 * @returns {string} - The signed JWT refresh token.
 */
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    },
  );
};

// Export the User model
export default mongoose.model('User', userSchema);
