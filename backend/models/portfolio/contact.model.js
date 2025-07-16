import mongoose from 'mongoose';

/**
 * Contact Schema
 * Stores contact form submissions.
 */
const contactSchema = new mongoose.Schema(
    {
        /**
         * Name of the person submitting the contact form.
         * @type {string}
         */
        name: {
            type: String,
            required: true,
            trim: true,
        },
        /**
         * Email address of the person submitting the contact form.
         * @type {string}
         */
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        /**
         * Subject of the contact message.
         * @type {string}
         */
        subject: {
            type: String,
            required: true,
            trim: true,
        },
        /**
         * Message content of the contact form.
         * @type {string}
         */
        message: {
            type: String,
            required: true,
            trim: true,
        },
    },
    { timestamps: true }, // Adds createdAt and updatedAt fields
);

/**
 * Contact model for MongoDB.
 */
export default mongoose.model('Contact', contactSchema);
