import mongoose from 'mongoose';

/**
 * Introduction Schema
 * Represents a user's portfolio introduction section.
 */
const introductionSchema = new mongoose.Schema(
    {
        /**
         * Reference to the User who owns this introduction.
         * Each user can have only one introduction.
         * @type {mongoose.Schema.Types.ObjectId}
         */
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
            unique: true,
        },
        /**
         * Greeting message (e.g., "Hello, I'm ...").
         * @type {string}
         */
        greeting: {
            type: String,
            required: true,
            trim: true,
        },
        /**
         * User's name.
         * @type {string}
         */
        name: {
            type: String,
            required: true,
            trim: true,
        },
        /**
         * Short tagline or headline.
         * @type {string}
         */
        tagline: {
            type: String,
            required: true,
            trim: true,
        },
        /**
         * Detailed description or bio.
         * @type {string}
         */
        description: {
            type: String,
            required: true,
            trim: true,
        },
        /**
         * URL to the user's profile image.
         * @type {string}
         */
        profileImage: {
            type: String,
            default: '',
            trim: true,
        },
        /**
         * URL to the user's resume file.
         * @type {string}
         */
        resume: {
            type: String,
            default: '',
            trim: true,
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    },
);

/**
 * Introduction model for MongoDB.
 */
export default mongoose.model('Introduction', introductionSchema);
