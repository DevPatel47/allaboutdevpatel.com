/**
 * PortfolioService
 * Service for handling Portfolio API requests.
 * Provides a method to fetch a complete portfolio by username, including all related sections.
 * Uses fetch API and returns a Portfolio model instance.
 */

import Portfolio from '../../model/portfolio/Portfolio.model.js';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
const HOST = `${BASE_URL}/portfolio`;

/**
 * PortfolioService constructor.
 * @constructor
 */
function PortfolioService() {
    /**
     * @type {string}
     * @private
     */
    this.host = HOST;
}

/**
 * Fetch a complete portfolio by username.
 * Calls GET /api/v1/portfolio/:username on the backend.
 * @param {string} username - The username to fetch the portfolio for.
 * @returns {Promise<Portfolio>} - The Portfolio model instance.
 * @throws {Error} If portfolio not found or request fails.
 */
PortfolioService.prototype.getByUsername = async function (username) {
    // GET /api/v1/portfolio/:username
    const response = await fetch(`${this.host}/${username}`, {
        method: 'GET',
    });
    const data = await response.json();
    if (data?.data?.portfolio) {
        return new Portfolio(data.data.portfolio);
    }
    throw new Error(data.message || 'Portfolio not found');
};

export default new PortfolioService();
