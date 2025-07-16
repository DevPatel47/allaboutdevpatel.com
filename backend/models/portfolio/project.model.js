import mongoose from 'mongoose';

/**
 * Project Schema
 * Stores project records for a user.
 */
const projectSchema = new mongoose.Schema(
    {
        /**
         * Reference to the User who owns this project.
         * @type {mongoose.Schema.Types.ObjectId}
         */
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        /**
         * Title of the project.
         * @type {string}
         */
        title: {
            type: String,
            required: true,
            trim: true,
        },
        /**
         * Unique slug for the project.
         * @type {string}
         */
        slug: {
            type: String,
            unique: true,
            required: true,
            trim: true,
            lowercase: true,
        },
        /**
         * Description of the project.
         * @type {string}
         */
        description: {
            type: String,
            required: true,
            trim: true,
        },
        /**
         * List of technologies used in the project.
         * @type {Array<string>}
         */
        techStack: [
            {
                type: String,
                trim: true,
            },
        ],
        /**
         * Image URL for the project.
         * @type {string}
         */
        image: {
            type: String,
            trim: true,
            default: '',
        },
        /**
         * Video URL for the project.
         * @type {string}
         */
        video: {
            type: String,
            trim: true,
            default: '',
        },
        /**
         * Live link to the deployed project.
         * @type {string}
         */
        liveLink: {
            type: String,
            trim: true,
            default: '',
        },
        /**
         * Repository link for the project.
         * @type {string}
         */
        repoLink: {
            type: String,
            trim: true,
            default: '',
        },
        /**
         * Tags associated with the project.
         * @type {Array<string>}
         */
        tags: [
            {
                type: String,
                trim: true,
            },
        ],
        /**
         * Indicates if the project is featured.
         * @type {boolean}
         */
        featured: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }, // Adds createdAt and updatedAt fields
);

/**
 * Project model for MongoDB.
 */
export default mongoose.model('Project', projectSchema);
