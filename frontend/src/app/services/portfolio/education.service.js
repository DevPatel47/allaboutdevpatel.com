/**
 * EducationService
 * Service for handling Education API requests.
 * Provides methods to create, retrieve, update, and delete education entries for a user.
 * Uses fetch API and returns Education model instances where appropriate.
 */

import Education from '../../model/portfolio/Education.model.js';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
const HOST = `${BASE_URL}/portfolio/educations`;

/**
 * EducationService constructor.
 * @constructor
 */
function EducationService() {
    /**
     * @type {string}
     * @private
     */
    this.host = HOST;
}

/**
 * Create a new education entry for a user.
 * @param {string} userId - The user's ID.
 * @param {FormData} formData - FormData containing education fields and files.
 * @returns {Promise<Education>}
 * @throws {Error} If creation fails.
 */
EducationService.prototype.create = async function (userId, formData) {
    // POST /api/v1/portfolio/educations/:userId
    const response = await fetch(`${this.host}/${userId}`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
    });
    const data = await response.json();
    if (data?.data?.education) {
        return new Education(data.data.education);
    }
    throw new Error(data.message || 'Failed to create education');
};

/**
 * Get all education entries by userId.
 * @param {string} userId - The user's ID.
 * @returns {Promise<Education[]>}
 * @throws {Error} If not found.
 */
EducationService.prototype.getByUserId = async function (userId) {
    // GET /api/v1/portfolio/educations/byuserid/:userId
    const response = await fetch(`${this.host}/byuserid/${userId}`);
    const data = await response.json();
    if (Array.isArray(data?.data?.educations)) {
        return data.data.educations.map((e) => new Education(e));
    }
    throw new Error(data.message || 'No educations found');
};

/**
 * Get an education entry by its ID.
 * @param {string} educationId - The education's ID.
 * @returns {Promise<Education>}
 * @throws {Error} If not found.
 */
EducationService.prototype.getById = async function (educationId) {
    // GET /api/v1/portfolio/educations/byeducationid/:educationId
    const response = await fetch(`${this.host}/byeducationid/${educationId}`);
    const data = await response.json();
    if (data?.data?.education) {
        return new Education(data.data.education);
    }
    throw new Error(data.message || 'Education not found');
};

/**
 * Update an education entry by its ID.
 * @param {string} educationId - The education's ID.
 * @param {FormData} formData - FormData containing updated fields and files.
 * @returns {Promise<Education>}
 * @throws {Error} If update fails.
 */
EducationService.prototype.update = async function (educationId, formData) {
    // PUT /api/v1/portfolio/educations/:educationId
    const response = await fetch(`${this.host}/${educationId}`, {
        method: 'PUT',
        credentials: 'include',
        body: formData,
    });
    const data = await response.json();
    if (data?.data?.education) {
        return new Education(data.data.education);
    }
    throw new Error(data.message || 'Failed to update education');
};

/**
 * Delete an education entry by its ID.
 * @param {string} educationId - The education's ID.
 * @returns {Promise<boolean>} True if deleted, false otherwise.
 */
EducationService.prototype.delete = async function (educationId) {
    // DELETE /api/v1/portfolio/educations/:educationId
    const response = await fetch(`${this.host}/${educationId}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    const data = await response.json();
    return data.success || false;
};

export default new EducationService();
