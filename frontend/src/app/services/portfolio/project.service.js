/**
 * ProjectService
 * Service for handling Project API requests.
 * Provides methods to create, retrieve, update, and delete project entries for a user.
 * Uses fetch API and returns Project model instances where appropriate.
 */

import Project from '../../model/portfolio/Project.model.js';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
const HOST = `${BASE_URL}/portfolio/projects`;

/**
 * ProjectService constructor.
 * @constructor
 */
function ProjectService() {
    /**
     * @type {string}
     * @private
     */
    this.host = HOST;
}

/**
 * Create a new project for a user (supports file upload via FormData).
 * @param {string} userId - The user's ID.
 * @param {FormData} formData - FormData containing project fields and files.
 * @returns {Promise<Project>} Project model instance.
 * @throws {Error} If creation fails.
 */
ProjectService.prototype.create = async function (userId, formData) {
    // POST /api/v1/portfolio/projects/:userId
    const response = await fetch(`${this.host}/${userId}`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
    });
    const data = await response.json();
    if (data?.data?.project) {
        return new Project(data.data.project);
    }
    throw new Error(data.message || 'Failed to create project');
};

/**
 * Get all projects by userId.
 * @param {string} userId - The user's ID.
 * @returns {Promise<Project[]>}
 * @throws {Error} If not found.
 */
ProjectService.prototype.getByUserId = async function (userId) {
    // GET /api/v1/portfolio/projects/byuserid/:userId
    const response = await fetch(`${this.host}/byuserid/${userId}`);
    const data = await response.json();
    if (Array.isArray(data?.data?.projects)) {
        return data.data.projects.map((p) => new Project(p));
    }
    throw new Error(data.message || 'No projects found');
};

/**
 * Get a project by its ID.
 * @param {string} projectId - The project's ID.
 * @returns {Promise<Project>}
 * @throws {Error} If not found.
 */
ProjectService.prototype.getById = async function (projectId) {
    // GET /api/v1/portfolio/projects/byprojectid/:projectId
    const response = await fetch(`${this.host}/byprojectid/${projectId}`);
    const data = await response.json();
    if (data?.data?.project) {
        return new Project(data.data.project);
    }
    throw new Error(data.message || 'Project not found');
};

/**
 * Get a project by its slug.
 * @param {string} slug - The project's slug.
 * @returns {Promise<Project>}
 * @throws {Error} If not found.
 */
ProjectService.prototype.getBySlug = async function (slug) {
    // GET /api/v1/portfolio/projects/byslug/:slug
    const response = await fetch(`${this.host}/byslug/${slug}`);
    const data = await response.json();
    if (data?.data?.project) {
        return new Project(data.data.project);
    }
    throw new Error(data.message || 'Project not found');
};

/**
 * Update a project by its ID (supports file upload via FormData).
 * @param {string} projectId - The project's ID.
 * @param {FormData} formData - FormData containing updated fields and files.
 * @returns {Promise<Project>}
 * @throws {Error} If update fails.
 */
ProjectService.prototype.update = async function (projectId, formData) {
    // PUT /api/v1/portfolio/projects/:projectId
    const response = await fetch(`${this.host}/${projectId}`, {
        method: 'PUT',
        credentials: 'include',
        body: formData,
    });
    const data = await response.json();
    if (data?.data?.project) {
        return new Project(data.data.project);
    }
    throw new Error(data.message || 'Failed to update project');
};

/**
 * Delete a project by its ID.
 * @param {string} projectId - The project's ID.
 * @returns {Promise<boolean>} True if deleted, false otherwise.
 */
ProjectService.prototype.delete = async function (projectId) {
    // DELETE /api/v1/portfolio/projects/:projectId
    const response = await fetch(`${this.host}/${projectId}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    const data = await response.json();
    return data.success || false;
};

export default new ProjectService();
