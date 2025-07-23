/**
 * ExperienceService
 * Service for handling Experience API requests.
 * Provides methods to create, retrieve, update, and delete experience entries for a user.
 * Uses fetch API and returns Experience model instances where appropriate.
 */

import Experience from '../../model/portfolio/Experience.model.js';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
const HOST = `${BASE_URL}/portfolio/experiences`;

/**
 * ExperienceService constructor.
 * @constructor
 */
function ExperienceService() {
    /**
     * @type {string}
     * @private
     */
    this.host = HOST;
}

/**
 * Create a new experience entry for a user.
 * @param {string} userId - The user's ID.
 * @param {FormData} formData - FormData containing experience fields and files.
 * @returns {Promise<Experience>}
 * @throws {Error} If creation fails.
 */
ExperienceService.prototype.create = async function (userId, formData) {
    // POST /api/v1/portfolio/experiences/:userId
    const response = await fetch(`${this.host}/${userId}`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
    });
    const data = await response.json();
    if (data?.data?.experience) {
        return new Experience(data.data.experience);
    }
    throw new Error(data.message || 'Failed to create experience');
};

/**
 * Get all experience entries by userId.
 * @param {string} userId - The user's ID.
 * @returns {Promise<Experience[]>}
 * @throws {Error} If not found.
 */
ExperienceService.prototype.getByUserId = async function (userId) {
    // GET /api/v1/portfolio/experiences/byuserid/:userId
    const response = await fetch(`${this.host}/byuserid/${userId}`);
    const data = await response.json();
    if (Array.isArray(data?.data?.experiences)) {
        return data.data.experiences.map((e) => new Experience(e));
    }
    throw new Error(data.message || 'No experiences found');
};

/**
 * Get an experience entry by its ID.
 * @param {string} experienceId - The experience's ID.
 * @returns {Promise<Experience>}
 * @throws {Error} If not found.
 */
ExperienceService.prototype.getById = async function (experienceId) {
    // GET /api/v1/portfolio/experiences/byexperienceid/:experienceId
    const response = await fetch(`${this.host}/byexperienceid/${experienceId}`);
    const data = await response.json();
    if (data?.data?.experience) {
        return new Experience(data.data.experience);
    }
    throw new Error(data.message || 'Experience not found');
};

/**
 * Update an experience entry by its ID.
 * @param {string} experienceId - The experience's ID.
 * @param {FormData} formData - FormData containing updated fields and files.
 * @returns {Promise<Experience>}
 * @throws {Error} If update fails.
 */
ExperienceService.prototype.update = async function (experienceId, formData) {
    // PUT /api/v1/portfolio/experiences/:experienceId
    const response = await fetch(`${this.host}/${experienceId}`, {
        method: 'PUT',
        credentials: 'include',
        body: formData,
    });
    const data = await response.json();
    if (data?.data?.experience) {
        return new Experience(data.data.experience);
    }
    throw new Error(data.message || 'Failed to update experience');
};

/**
 * Delete an experience entry by its ID.
 * @param {string} experienceId - The experience's ID.
 * @returns {Promise<boolean>} True if deleted, false otherwise.
 */
ExperienceService.prototype.delete = async function (experienceId) {
    // DELETE /api/v1/portfolio/experiences/:experienceId
    const response = await fetch(`${this.host}/${experienceId}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    const data = await response.json();
    return data.success || false;
};

export default new ExperienceService();
