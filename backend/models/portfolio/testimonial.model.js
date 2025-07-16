import mongoose from 'mongoose';

/**
 * Testimonial Schema
 * Stores testimonial records for a user.
 */
const testimonialSchema = new mongoose.Schema(
    {
        /**
         * Reference to the User who owns this testimonial.
         * @type {mongoose.Schema.Types.ObjectId}
         */
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        /**
         * Name of the person giving the testimonial.
         * @type {string}
         */
        name: {
            type: String,
            required: true,
            trim: true,
        },
        /**
         * Role or position of the person giving the testimonial.
         * @type {string}
         */
        role: {
            type: String,
            required: true,
            trim: true,
        },
        /**
         * Content of the testimonial.
         * @type {string}
         */
        content: {
            type: String,
            required: true,
            trim: true,
        },
        /**
         * Image URL of the person giving the testimonial.
         * @type {string}
         */
        image: {
            type: String,
            trim: true,
            default: '',
        },
        /**
         * LinkedIn profile URL of the person giving the testimonial.
         * @type {string}
         */
        linkedIn: {
            type: String,
            trim: true,
            default: '',
        },
    },
    { timestamps: true }, // Adds createdAt and updatedAt fields
);

/**
 * Testimonial model for MongoDB.
 */
export default mongoose.model('Testimonial', testimonialSchema);
