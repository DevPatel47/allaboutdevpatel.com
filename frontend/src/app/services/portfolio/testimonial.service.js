/**
 * TestimonialService
 * Service for handling Testimonial API requests.
 * Provides methods to create, retrieve, update, and delete testimonial entries for a user.
 * Uses fetch API and returns Testimonial model instances where appropriate.
 */

import Testimonial from '../../model/portfolio/Testimonial.model.js';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
const HOST = `${BASE_URL}/portfolio/testimonials`;

/**
 * TestimonialService constructor.
 * @constructor
 */
function TestimonialService() {
    /**
     * @type {string}
     * @private
     */
    this.host = HOST;
}

/**
 * Create a new testimonial for a user (supports file upload via FormData).
 * @param {string} userId - The user's ID.
 * @param {FormData} formData - FormData containing testimonial fields and files.
 * @returns {Promise<Testimonial>} Testimonial model instance.
 * @throws {Error} If creation fails.
 */
TestimonialService.prototype.create = async function (userId, formData) {
    // POST /api/v1/portfolio/testimonials/:userId
    const response = await fetch(`${this.host}/${userId}`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
    });
    const data = await response.json();
    if (data?.data?.testimonial) {
        return new Testimonial(data.data.testimonial);
    }
    throw new Error(data.message || 'Failed to create testimonial');
};

/**
 * Get all testimonials by userId.
 * @param {string} userId - The user's ID.
 * @returns {Promise<Testimonial[]>}
 * @throws {Error} If not found.
 */
TestimonialService.prototype.getByUserId = async function (userId) {
    // GET /api/v1/portfolio/testimonials/byuserid/:userId
    const response = await fetch(`${this.host}/byuserid/${userId}`);
    const data = await response.json();
    if (Array.isArray(data?.data?.testimonials)) {
        return data.data.testimonials.map((t) => new Testimonial(t));
    }
    throw new Error(data.message || 'No testimonials found');
};

/**
 * Get a testimonial by its ID.
 * @param {string} testimonialId - The testimonial's ID.
 * @returns {Promise<Testimonial>}
 * @throws {Error} If not found.
 */
TestimonialService.prototype.getById = async function (testimonialId) {
    // GET /api/v1/portfolio/testimonials/bytestimonialid/:testimonialId
    const response = await fetch(`${this.host}/bytestimonialid/${testimonialId}`);
    const data = await response.json();
    if (data?.data?.testimonial) {
        return new Testimonial(data.data.testimonial);
    }
    throw new Error(data.message || 'Testimonial not found');
};

/**
 * Update a testimonial by its ID (supports file upload via FormData).
 * @param {string} testimonialId - The testimonial's ID.
 * @param {FormData} formData - FormData containing updated fields and files.
 * @returns {Promise<Testimonial>}
 * @throws {Error} If update fails.
 */
TestimonialService.prototype.update = async function (testimonialId, formData) {
    // PUT /api/v1/portfolio/testimonials/:testimonialId
    const response = await fetch(`${this.host}/${testimonialId}`, {
        method: 'PUT',
        credentials: 'include',
        body: formData,
    });
    const data = await response.json();
    if (data?.data?.testimonial) {
        return new Testimonial(data.data.testimonial);
    }
    throw new Error(data.message || 'Failed to update testimonial');
};

/**
 * Delete a testimonial by its ID.
 * @param {string} testimonialId - The testimonial's ID.
 * @returns {Promise<boolean>} True if deleted, false otherwise.
 */
TestimonialService.prototype.delete = async function (testimonialId) {
    // DELETE /api/v1/portfolio/testimonials/:testimonialId
    const response = await fetch(`${this.host}/${testimonialId}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    const data = await response.json();
    return data.success || false;
};

export default new TestimonialService();
