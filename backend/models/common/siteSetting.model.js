import mongoose from 'mongoose';

/**
 * SiteSetting Schema
 * Stores site configuration settings for a user.
 */
const siteSettingSchema = new mongoose.Schema(
    {
        /**
         * Reference to the User who owns these settings.
         * @type {mongoose.Schema.Types.ObjectId}
         */
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        /**
         * Theme preference for the site.
         * @type {string}
         */
        theme: {
            type: String,
            trim: true,
            default: 'dark',
        },
        /**
         * Font preference for the site.
         * @type {string}
         */
        font: {
            type: String,
            trim: true,
            default: 'Poppins',
        },
        /**
         * SEO settings for the site.
         * @type {object}
         */
        seo: {
            /**
             * SEO title for the site.
             * @type {string}
             */
            title: {
                type: String,
                trim: true,
                default: '',
            },
            /**
             * SEO description for the site.
             * @type {string}
             */
            description: {
                type: String,
                trim: true,
                default: '',
            },
            /**
             * SEO keywords for the site.
             * @type {Array<string>}
             */
            keywords: [
                {
                    type: String,
                    trim: true,
                    default: '',
                },
            ],
        },
        /**
         * Analytics settings for the site.
         * @type {object}
         */
        analytics: {
            /**
             * Google Analytics ID for tracking.
             * @type {string}
             */
            googleAnalyticsId: {
                type: String,
                trim: true,
                default: '',
            },
        },
    },
    { timestamps: true }, // Adds createdAt and updatedAt fields
);

/**
 * SiteSetting model for MongoDB.
 */
export default mongoose.model('SiteSetting', siteSettingSchema);
