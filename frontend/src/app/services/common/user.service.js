/**
 * UserService
 * Service for handling User API requests.
 * Provides methods to register, login, update, delete, and retrieve users.
 * Uses fetch API and returns User model instances where appropriate.
 */

import User from '../../model/common/User.model.js';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
const HOST = `${BASE_URL}/users`;

/**
 * UserService constructor.
 * @constructor
 */
function UserService() {
    /**
     * @type {string}
     * @private
     */
    this.host = HOST;
}

/**
 * Get all users (admin only).
 * @returns {Promise<User[]>} Array of User model instances.
 * @throws {Error} If no users found or request fails.
 */
UserService.prototype.getAllUsers = async function () {
    // GET /api/v1/users/retrieve
    const response = await fetch(`${this.host}/retrieve`, {
        method: 'GET',
        credentials: 'include',
    });
    const data = await response.json();
    if (Array.isArray(data?.data?.users)) {
        return data.data.users.map((u) => new User(u));
    }
    throw new Error(data.message || 'No users found');
};

/**
 * Get a user by ID (admin only).
 * @param {string} userId - The user's ID.
 * @returns {Promise<User>} User model instance.
 * @throws {Error} If user not found or request fails.
 */
UserService.prototype.getUserById = async function (userId) {
    // GET /api/v1/users/retrieve/:userId
    const response = await fetch(`${this.host}/retrieve/${userId}`, {
        method: 'GET',
        credentials: 'include',
    });
    const data = await response.json();
    if (data?.data?.user) {
        return new User(data.data.user);
    }
    throw new Error(data.message || 'User not found');
};

/**
 * Register a new user (supports file upload via FormData).
 * @param {FormData} formData - FormData instance with user fields and files.
 * @returns {Promise<User>} User model instance.
 * @throws {Error} If registration fails.
 */
UserService.prototype.register = async function (formData) {
    // POST /api/v1/users/register
    const response = await fetch(`${this.host}/register`, {
        method: 'POST',
        credentials: 'include',
        body: formData, // FormData instance
    });
    const data = await response.json();
    if (data?.data?.user) {
        return new User(data.data.user);
    }
    throw new Error(data.message || 'Registration failed');
};

/**
 * Update user profile (authenticated user, supports file upload via FormData).
 * @param {string} userId - The user's ID.
 * @param {FormData} formData - FormData instance with updated fields and files.
 * @returns {Promise<User>} Updated User model instance.
 * @throws {Error} If update fails.
 */
UserService.prototype.update = async function (userId, formData) {
    // PATCH /api/v1/users/update/:userId
    const response = await fetch(`${this.host}/update/${userId}`, {
        method: 'PATCH',
        credentials: 'include',
        body: formData, // FormData instance
    });
    const data = await response.json();
    if (data?.data?.user) {
        return new User(data.data.user);
    }
    throw new Error(data.message || 'Update failed');
};

/**
 * Change current user's password.
 * @param {string} currentPassword - The current password.
 * @param {string} newPassword - The new password.
 * @returns {Promise<boolean>} True if password changed, false otherwise.
 */
UserService.prototype.changePassword = async function (currentPassword, newPassword) {
    // PATCH /api/v1/users/change-password
    const response = await fetch(`${this.host}/change-password`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await response.json();
    return data.success || false;
};

/**
 * Delete a user by ID (admin only).
 * @param {string} userId - The user's ID.
 * @returns {Promise<boolean>} True if deleted, false otherwise.
 */
UserService.prototype.deleteUser = async function (userId) {
    // DELETE /api/v1/users/delete/:userId
    const response = await fetch(`${this.host}/delete/${userId}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    const data = await response.json();
    return data.success || false;
};

/**
 * Delete the current authenticated user.
 * @returns {Promise<boolean>} True if deleted, false otherwise.
 */
UserService.prototype.deleteCurrentUser = async function () {
    // DELETE /api/v1/users/delete
    const response = await fetch(`${this.host}/delete`, {
        method: 'DELETE',
        credentials: 'include',
    });
    const data = await response.json();
    return data.success || false;
};

/**
 * Login user.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<User>} User model instance.
 * @throws {Error} If login fails.
 */
UserService.prototype.login = async function (identifier, password) {
    // Supports username OR email based on presence of '@'
    const payload = identifier.includes('@')
        ? { email: identifier.trim(), password }
        : { username: identifier.trim(), password };

    const response = await fetch(`${this.host}/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (data?.data?.user) {
        return new User(data.data.user);
    }
    throw new Error(data.message || 'Login failed');
};

/**
 * Logout user.
 * @returns {Promise<boolean>} True if logout successful, false otherwise.
 */
UserService.prototype.logout = async function () {
    // POST /api/v1/users/logout
    const response = await fetch(`${this.host}/logout`, {
        method: 'POST',
        credentials: 'include',
    });
    const data = await response.json();
    return data.success || false;
};

/**
 * Refresh access token.
 * @returns {Promise<string>} The new access token.
 */
UserService.prototype.refreshToken = async function () {
    // POST /api/v1/users/refresh-token
    const response = await fetch(`${this.host}/refresh-token`, {
        method: 'POST',
        credentials: 'include',
    });
    const data = await response.json();
    return data?.data?.accessToken || '';
};

/**
 * Get current authenticated user.
 * @returns {Promise<User>} User model instance.
 * @throws {Error} If user not found.
 */
UserService.prototype.getCurrentUser = async function () {
    // GET /api/v1/users/current-user
    const response = await fetch(`${this.host}/current-user`, {
        method: 'GET',
        credentials: 'include',
    });
    const data = await response.json();
    if (response.ok && data?.data?.user) {
        return new User(data.data.user);
    }
    throw new Error(data.message || 'Not authenticated');
};

/**
 * Update a user's role (admin only).
 * @param {string} userId - The user's ID.
 * @param {string} role - The new role ('admin' or 'user').
 * @returns {Promise<User>} Updated User model instance.
 * @throws {Error} If update fails.
 */
UserService.prototype.updateRole = async function (userId, role) {
    // PATCH /api/v1/users/update-role/:userId
    const response = await fetch(`${this.host}/update-role/${userId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role }),
    });
    const data = await response.json();
    if (data?.data?.user) {
        return new User(data.data.user);
    }
    throw new Error(data.message || 'Role update failed');
};

export default new UserService();
