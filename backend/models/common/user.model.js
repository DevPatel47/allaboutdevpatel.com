import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

/**
 * User Schema
 * Structure for user documents in MongoDB.
 * Includes authentication, profile, and role management fields.
 */
const userSchema = new mongoose.Schema(
    {
        /**
         * Unique username for the user.
         * @type {string}
         */
        username: {
            type: String,
            unique: true,
            required: true,
            trim: true,
        },
        /**
         * Unique email address for the user.
         * @type {string}
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
         * @type {string}
         */
        password: {
            type: String,
            required: true,
        },
        /**
         * Profile image URL for the user.
         * @type {string}
         */
        profileImage: {
            type: String,
            default: '',
        },
        /**
         * User role, either 'admin' or 'user'.
         * @type {string}
         */
        role: {
            type: String,
            enum: ['admin', 'user'],
            default: 'user',
        },
        /**
         * Refresh token for session management.
         * @type {string}
         */
        refreshToken: {
            type: String,
            default: '',
        },
    },
    { timestamps: true }, // Adds createdAt and updatedAt fields
);

/**
 * Hashes the password before saving if it has been modified.
 */
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

/**
 * Checks if the provided password matches the stored hashed password.
 * @param {string} password - The plain text password to compare.
 * @returns {Promise<boolean>} True if the password matches, false otherwise.
 */
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

/**
 * Generates a JWT access token for the user.
 * @returns {string} The signed JWT access token.
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
 * @returns {string} The signed JWT refresh token.
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

/**
 * User model for MongoDB.
 */
export default mongoose.model('User', userSchema);
