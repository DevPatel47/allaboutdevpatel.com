export default class User {
    /**
     * Constructs a User instance.
     * @param {Object} param0 - The user data object.
     * @param {string|null} param0._id - The unique identifier for the user.
     * @param {string} param0.username - The username of the user.
     * @param {string} param0.email - The email address of the user.
     * @param {string} [param0.profileImage=''] - The profile image URL or path (optional).
     * @param {string} [param0.role='user'] - The user's role (optional).
     * @param {string} [param0.refreshToken=''] - The refresh token for authentication (optional).
     * @param {string} [param0.createdAt=''] - Creation date (optional).
     * @param {string} [param0.updatedAt=''] - Update date (optional).
     */
    constructor({
        _id = null,
        username,
        email,
        profileImage = '',
        role = 'user',
        refreshToken = '',
        createdAt = '',
        updatedAt = ''
    } = {}) {
        this._id = _id;
        this.username = username;
        this.email = email;
        this.profileImage = profileImage;
        this.role = role;
        this.refreshToken = refreshToken;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    /**
     * Converts the User instance to a plain object for serialization.
     * @returns {Object} - The JSON representation of the user.
     */
    toJSON() {
        return {
            _id: this._id,
            username: this.username,
            email: this.email,
            profileImage: this.profileImage,
            role: this.role,
            refreshToken: this.refreshToken,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}