import mongoose from 'mongoose';

/**
 * Experience Schema
 * Stores work experience records for a user.
 */
const experienceSchema = new mongoose.Schema(
    {
        /**
         * Reference to the User who owns this experience record.
         * @type {mongoose.Schema.Types.ObjectId}
         */
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        /**
         * Job title or position held.
         * @type {string}
         */
        title: {
            type: String,
            required: true,
            trim: true,
        },
        /**
         * Name of the company or organization.
         * @type {string}
         */
        company: {
            type: String,
            required: true,
            trim: true,
        },
        /**
         * Location of the job or company.
         * @type {string}
         */
        location: {
            type: String,
            trim: true,
            default: '',
        },
        /**
         * Start date of the experience period.
         * @type {Date}
         */
        startDate: {
            type: Date,
            required: true,
        },
        /**
         * End date of the experience period.
         * @type {Date}
         */
        endDate: {
            type: Date,
        },
        /**
         * List of responsibilities or tasks performed.
         * @type {Array<string>}
         */
        responsibilities: {
            type: [String],
            default: [],
        },
        /**
         * List of technologies used during the experience.
         * @type {Array<string>}
         */
        techStack: {
            type: [String],
            default: [],
        },
        /**
         * Logo image URL for the company or organization.
         * @type {string}
         */
        logo: {
            type: String,
            trim: true,
            default: '',
        },
    },
    { timestamps: true }, // Adds createdAt and updatedAt fields
);

/**
 * Experience model for MongoDB.
 */
export default mongoose.model('Experience', experienceSchema);
