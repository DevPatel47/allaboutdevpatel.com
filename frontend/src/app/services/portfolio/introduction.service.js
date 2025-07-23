/**
 * IntroductionService
 * Service for handling Introduction API requests.
 * Provides methods to create, retrieve, update, and delete introduction data for a user.
 * Uses fetch API and returns Introduction model instances where appropriate.
 */

import Introduction from '../../model/portfolio/Introduction.model.js';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
const HOST = `${BASE_URL}/portfolio/introductions`;

/**
 * IntroductionService constructor.
 * @constructor
 */
function IntroductionService() {
    /**
     * @type {string}
     * @private
     */
    this.host = HOST;
}

/**
 * Create a new introduction for a user (supports file upload via FormData).
 * @param {string} userId - The user's ID.
 * @param {FormData} formData - FormData instance with introduction fields and files.
 * @returns {Promise<Introduction>} Introduction model instance.
 * @throws {Error} If creation fails.
 */
IntroductionService.prototype.create = async function (userId, formData) {
    // POST /api/v1/portfolio/introductions/:userId
    const response = await fetch(`${this.host}/${userId}`, {
        method: 'POST',
        credentials: 'include',
        body: formData, // FormData instance
    });
    const data = await response.json();
    if (data?.data?.introduction) {
        return new Introduction(data.data.introduction);
    }
    throw new Error(data.message || 'Failed to create introduction');
};

/**
 * Get introduction by userId (public).
 * @param {string} userId - The user's ID.
 * @returns {Promise<Introduction>} Introduction model instance.
 * @throws {Error} If not found.
 */
IntroductionService.prototype.getByUserId = async function (userId) {
    // GET /api/v1/portfolio/introductions/:userId
    const response = await fetch(`${this.host}/${userId}`);
    const data = await response.json();
    if (data?.data?.introduction) {
        return new Introduction(data.data.introduction);
    }
    throw new Error(data.message || 'Introduction not found');
};

/**
 * Update introduction for a user (supports file upload via FormData).
 * @param {string} userId - The user's ID.
 * @param {FormData} formData - FormData instance with updated fields and files.
 * @returns {Promise<Introduction>} Updated Introduction model instance.
 * @throws {Error} If update fails.
 */
IntroductionService.prototype.update = async function (userId, formData) {
    // PUT /api/v1/portfolio/introductions/:userId
    const response = await fetch(`${this.host}/${userId}`, {
        method: 'PUT',
        credentials: 'include',
        body: formData, // FormData instance
    });
    const data = await response.json();
    if (data?.data?.introduction) {
        return new Introduction(data.data.introduction);
    }
    throw new Error(data.message || 'Failed to update introduction');
};

/**
 * Delete introduction for a user.
 * @param {string} userId - The user's ID.
 * @returns {Promise<boolean>} True if deleted, false otherwise.
 */
IntroductionService.prototype.delete = async function (userId) {
    // DELETE /api/v1/portfolio/introductions/:userId
    const response = await fetch(`${this.host}/${userId}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    const data = await response.json();
    return data.success || false;
};

export default new IntroductionService();
