import mongoose from 'mongoose';

/**
 * Education Schema
 * Stores education records for a user.
 */
const educationSchema = new mongoose.Schema(
    {
        /**
         * Reference to the User who owns this education record.
         * @type {mongoose.Schema.Types.ObjectId}
         */
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        /**
         * Name of the educational institution.
         * @type {string}
         */
        institution: {
            type: String,
            required: true,
            trim: true,
        },
        /**
         * Degree obtained or pursued.
         * @type {string}
         */
        degree: {
            type: String,
            required: true,
            trim: true,
        },
        /**
         * Field of study.
         * @type {string}
         */
        fieldOfStudy: {
            type: String,
            required: true,
            trim: true,
        },
        /**
         * Start date of the education period.
         * @type {Date}
         */
        startDate: {
            type: Date,
            required: true,
        },
        /**
         * End date of the education period.
         * @type {Date}
         */
        endDate: {
            type: Date,
        },
        /**
         * Grade or score achieved.
         * @type {string}
         */
        grade: {
            type: String,
            trim: true,
            default: '',
        },
        /**
         * Description or notes about the education.
         * @type {string}
         */
        description: {
            type: String,
            trim: true,
            default: '',
        },
        /**
         * Logo image URL for the institution.
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
 * Education model for MongoDB.
 */
export default mongoose.model('Education', educationSchema);
