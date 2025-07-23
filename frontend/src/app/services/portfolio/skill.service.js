/**
 * SkillService
 * Service for handling Skill API requests.
 * Provides methods to create, retrieve, update, and delete skill entries for a user.
 * Uses fetch API and returns Skill model instances where appropriate.
 */

import Skill from '../../model/portfolio/Skill.model.js';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
const HOST = `${BASE_URL}/portfolio/skills`;

/**
 * SkillService constructor.
 * @constructor
 */
function SkillService() {
    /**
     * @type {string}
     * @private
     */
    this.host = HOST;
}

/**
 * Create a new skill for a user.
 * @param {string} userId - The user's ID.
 * @param {Object} data - The skill data object.
 * @returns {Promise<Skill>} Skill model instance.
 * @throws {Error} If creation fails.
 */
SkillService.prototype.create = async function (userId, data) {
    // POST /api/v1/portfolio/skills/:userId
    const response = await fetch(`${this.host}/${userId}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    const resData = await response.json();
    if (resData?.data?.skill) {
        return new Skill(resData.data.skill);
    }
    throw new Error(resData.message || 'Failed to create skill');
};

/**
 * Get all skills by userId.
 * @param {string} userId - The user's ID.
 * @returns {Promise<Skill[]>}
 * @throws {Error} If not found.
 */
SkillService.prototype.getByUserId = async function (userId) {
    // GET /api/v1/portfolio/skills/byuserid/:userId
    const response = await fetch(`${this.host}/byuserid/${userId}`);
    const data = await response.json();
    if (Array.isArray(data?.data?.skills)) {
        return data.data.skills.map((s) => new Skill(s));
    }
    throw new Error(data.message || 'No skills found');
};

/**
 * Get a skill by its ID.
 * @param {string} skillId - The skill's ID.
 * @returns {Promise<Skill>}
 * @throws {Error} If not found.
 */
SkillService.prototype.getById = async function (skillId) {
    // GET /api/v1/portfolio/skills/byskillid/:skillId
    const response = await fetch(`${this.host}/byskillid/${skillId}`);
    const data = await response.json();
    if (data?.data?.skill) {
        return new Skill(data.data.skill);
    }
    throw new Error(data.message || 'Skill not found');
};

/**
 * Update a skill by its ID.
 * @param {string} skillId - The skill's ID.
 * @param {Object} data - The updated skill data object.
 * @returns {Promise<Skill>}
 * @throws {Error} If update fails.
 */
SkillService.prototype.update = async function (skillId, data) {
    // PUT /api/v1/portfolio/skills/:skillId
    const response = await fetch(`${this.host}/${skillId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    const resData = await response.json();
    if (resData?.data?.skill) {
        return new Skill(resData.data.skill);
    }
    throw new Error(resData.message || 'Failed to update skill');
};

/**
 * Delete a skill by its ID.
 * @param {string} skillId - The skill's ID.
 * @returns {Promise<boolean>} True if deleted, false otherwise.
 */
SkillService.prototype.delete = async function (skillId) {
    // DELETE /api/v1/portfolio/skills/:skillId
    const response = await fetch(`${this.host}/${skillId}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    const data = await response.json();
    return data.success || false;
};

export default new SkillService();
