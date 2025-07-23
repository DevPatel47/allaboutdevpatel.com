/**
 * SocialLinkService
 * Service for handling Social Link API requests.
 * Provides methods to create, retrieve, update, and delete social link entries for a user.
 * Uses fetch API and returns SocialLink model instances where appropriate.
 */

import SocialLink from '../../model/portfolio/SocialLink.model.js';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
const HOST = `${BASE_URL}/portfolio/social-links`;

/**
 * SocialLinkService constructor.
 * @constructor
 */
function SocialLinkService() {
    /**
     * @type {string}
     * @private
     */
    this.host = HOST;
}

/**
 * Create a social link for a user (single link object).
 * @param {string} userId - The user's ID.
 * @param {Object} linkObj - The social link data object.
 * @returns {Promise<SocialLink>} SocialLink model instance.
 * @throws {Error} If creation fails.
 */
SocialLinkService.prototype.create = async function (userId, linkObj) {
    // POST /api/v1/portfolio/social-links/:userId
    const response = await fetch(`${this.host}/${userId}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(linkObj),
    });
    const data = await response.json();
    if (data?.data?.socialLink) {
        return new SocialLink(data.data.socialLink);
    }
    throw new Error(data.message || 'Failed to create social link');
};

/**
 * Get all social links for a user.
 * @param {string} userId - The user's ID.
 * @returns {Promise<SocialLink[]>}
 * @throws {Error} If not found.
 */
SocialLinkService.prototype.getByUserId = async function (userId) {
    // GET /api/v1/portfolio/social-links/byuserid/:userId
    const response = await fetch(`${this.host}/byuserid/${userId}`, {
        method: 'GET',
        credentials: 'include',
    });
    const data = await response.json();
    if (Array.isArray(data?.data?.socialLinks)) {
        return data.data.socialLinks.map((l) => new SocialLink(l));
    }
    throw new Error(data.message || 'No social links found');
};

/**
 * Get a specific social link by its ID.
 * @param {string} socialLinkId - The social link's ID.
 * @returns {Promise<SocialLink>}
 * @throws {Error} If not found.
 */
SocialLinkService.prototype.getById = async function (socialLinkId) {
    // GET /api/v1/portfolio/social-links/bysociallinkid/:socialLinkId
    const response = await fetch(`${this.host}/bysociallinkid/${socialLinkId}`, {
        method: 'GET',
        credentials: 'include',
    });
    const data = await response.json();
    if (data?.data?.socialLink) {
        return new SocialLink(data.data.socialLink);
    }
    throw new Error(data.message || 'Social link not found');
};

/**
 * Update a social link by its ID.
 * @param {string} socialLinkId - The social link's ID.
 * @param {Object} linkObj - The updated social link data object.
 * @returns {Promise<SocialLink>}
 * @throws {Error} If update fails.
 */
SocialLinkService.prototype.update = async function (socialLinkId, linkObj) {
    // PUT /api/v1/portfolio/social-links/:socialLinkId
    const response = await fetch(`${this.host}/${socialLinkId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(linkObj),
    });
    const data = await response.json();
    if (data?.data?.socialLink) {
        return new SocialLink(data.data.socialLink);
    }
    throw new Error(data.message || 'Failed to update social link');
};

/**
 * Delete a social link by its ID.
 * @param {string} socialLinkId - The social link's ID.
 * @returns {Promise<boolean>} True if deleted, false otherwise.
 */
SocialLinkService.prototype.delete = async function (socialLinkId) {
    // DELETE /api/v1/portfolio/social-links/:socialLinkId
    const response = await fetch(`${this.host}/${socialLinkId}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    const data = await response.json();
    return data.success || false;
};

export default new SocialLinkService();
