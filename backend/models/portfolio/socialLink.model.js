import mongoose from 'mongoose';

/**
 * SocialLink Schema
 * Stores social media links for a user.
 */

/**
 * SocialLink Schema
 * Stores a single social media link for a user.
 * Each document represents one link, similar to the Education model structure.
 */
const socialLinkSchema = new mongoose.Schema(
    {
        /**
         * Reference to the User who owns this social link.
         * @type {mongoose.Schema.Types.ObjectId}
         */
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        /**
         * Name of the social media platform.
         * @type {string}
         */
        platform: {
            type: String,
            required: true,
            trim: true,
        },
        /**
         * URL to the social media profile.
         * @type {string}
         */
        url: {
            type: String,
            required: true,
            trim: true,
        },
        /**
         * Icon representing the social media platform.
         * @type {string}
         */
        icon: {
            type: String,
            trim: true,
            default: '',
        },
    },
    { timestamps: true }, // Adds createdAt and updatedAt fields
);

/**
 * SocialLink model for MongoDB.
 */
export default mongoose.model('SocialLink', socialLinkSchema);
