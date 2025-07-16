import mongoose from 'mongoose';

/**
 * Certification Schema
 * Stores certification records for a user.
 */
const certificationSchema = new mongoose.Schema(
    {
        /**
         * Reference to the User who owns this certification.
         * @type {mongoose.Schema.Types.ObjectId}
         */
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        /**
         * Title of the certification.
         * @type {string}
         */
        title: {
            type: String,
            required: true,
            trim: true,
        },
        /**
         * Provider of the certification.
         * @type {string}
         */
        provider: {
            type: String,
            required: true,
            trim: true,
        },
        /**
         * Date the certification was issued.
         * @type {Date}
         */
        issueDate: {
            type: Date,
            required: true,
        },
        /**
         * Credential ID for the certification.
         * @type {string}
         */
        credentialId: {
            type: String,
            trim: true,
            default: '',
        },
        /**
         * Credential URL for the certification.
         * @type {string}
         */
        credentialUrl: {
            type: String,
            trim: true,
            default: '',
        },
        /**
         * Badge image URL for the certification.
         * @type {string}
         */
        badgeImage: {
            type: String,
            trim: true,
            default: '',
        },
    },
    { timestamps: true }, // Adds createdAt and updatedAt fields
);

/**
 * Certification model for MongoDB.
 */
export default mongoose.model('Certification', certificationSchema);
