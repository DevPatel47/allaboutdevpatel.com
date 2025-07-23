/**
 * CertificationService
 * Service for handling Certification API requests.
 * Provides methods to create, retrieve, update, and delete certifications for a user.
 * Uses fetch API and returns Certification model instances where appropriate.
 */

import Certification from '../../model/portfolio/Certification.model.js';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
const HOST = `${BASE_URL}/portfolio/certifications`;

/**
 * CertificationService constructor.
 * @constructor
 */
function CertificationService() {
    /**
     * @type {string}
     * @private
     */
    this.host = HOST;
}

/**
 * Create a new certification for a user.
 * @param {string} userId - The user's ID.
 * @param {FormData} formData - FormData containing certification fields and files.
 * @returns {Promise<Certification>}
 * @throws {Error} If creation fails.
 */
CertificationService.prototype.create = async function (userId, formData) {
    // POST /api/v1/portfolio/certifications/:userId
    const response = await fetch(`${this.host}/${userId}`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
    });
    const data = await response.json();
    if (data?.data?.certification) {
        return new Certification(data.data.certification);
    }
    throw new Error(data.message || 'Failed to create certification');
};

/**
 * Get all certifications by userId.
 * @param {string} userId - The user's ID.
 * @returns {Promise<Certification[]>}
 * @throws {Error} If not found.
 */
CertificationService.prototype.getByUserId = async function (userId) {
    // GET /api/v1/portfolio/certifications/byuserid/:userId
    const response = await fetch(`${this.host}/byuserid/${userId}`);
    const data = await response.json();
    if (Array.isArray(data?.data?.certifications)) {
        return data.data.certifications.map((c) => new Certification(c));
    }
    throw new Error(data.message || 'No certifications found');
};

/**
 * Get a certification by its ID.
 * @param {string} certificationId - The certification's ID.
 * @returns {Promise<Certification>}
 * @throws {Error} If not found.
 */
CertificationService.prototype.getById = async function (certificationId) {
    // GET /api/v1/portfolio/certifications/bycertid/:certificationId
    const response = await fetch(`${this.host}/bycertid/${certificationId}`);
    const data = await response.json();
    if (data?.data?.certification) {
        return new Certification(data.data.certification);
    }
    throw new Error(data.message || 'Certification not found');
};

/**
 * Update a certification by its ID.
 * @param {string} certificationId - The certification's ID.
 * @param {FormData} formData - FormData containing updated fields and files.
 * @returns {Promise<Certification>}
 * @throws {Error} If update fails.
 */
CertificationService.prototype.update = async function (certificationId, formData) {
    // PUT /api/v1/portfolio/certifications/:certificationId
    const response = await fetch(`${this.host}/${certificationId}`, {
        method: 'PUT',
        credentials: 'include',
        body: formData,
    });
    const data = await response.json();
    if (data?.data?.certification) {
        return new Certification(data.data.certification);
    }
    throw new Error(data.message || 'Failed to update certification');
};

/**
 * Delete a certification by its ID.
 * @param {string} certificationId - The certification's ID.
 * @returns {Promise<boolean>} True if deleted, false otherwise.
 */
CertificationService.prototype.delete = async function (certificationId) {
    // DELETE /api/v1/portfolio/certifications/:certificationId
    const response = await fetch(`${this.host}/${certificationId}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    const data = await response.json();
    return data.success || false;
};

export default new CertificationService();
