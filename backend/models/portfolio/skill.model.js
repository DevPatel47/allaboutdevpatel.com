import mongoose from 'mongoose';

/**
 * Skill Schema
 * Stores skill categories and skill details for a user.
 */
const skillSchema = new mongoose.Schema(
    {
        /**
         * Reference to the User who owns these skills.
         * @type {mongoose.Schema.Types.ObjectId}
         */
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        /**
         * Category of the skills (e.g., "Frontend", "Backend").
         * @type {string}
         */
        category: {
            type: String,
            required: true,
            trim: true,
        },
        /**
         * List of skills in the category.
         * @type {Array<object>}
         */
        skills: [
            {
                /**
                 * Name of the skill.
                 * @type {string}
                 */
                name: {
                    type: String,
                    required: true,
                    trim: true,
                },
                /**
                 * Level of proficiency for the skill.
                 * @type {string}
                 */
                level: {
                    type: String,
                    enum: ['Beginner', 'Intermediate', 'Advanced'],
                    required: true,
                    trim: true,
                },
            },
        ],
    },
    { timestamps: true }, // Adds createdAt and updatedAt fields
);

/**
 * Skill model for MongoDB.
 */
export default mongoose.model('Skill', skillSchema);
