export default class SocialLink {
    /**
     * Constructs a SocialLink instance.
     * @param {Object} param0
     * @param {string|null} param0._id
     * @param {string} param0.userId
     * @param {string} param0.platform
     * @param {string} param0.url
     * @param {string} [param0.icon='']
     * @param {string} [param0.createdAt='']
     * @param {string} [param0.updatedAt='']
     */
    constructor({
        _id = null,
        userId,
        platform,
        url,
        icon = '',
        createdAt = '',
        updatedAt = ''
    } = {}) {
        this._id = _id;
        this.userId = userId;
        this.platform = platform;
        this.url = url;
        this.icon = icon;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    toJSON() {
        return {
            _id: this._id,
            userId: this.userId,
            platform: this.platform,
            url: this.url,
            icon: this.icon,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}