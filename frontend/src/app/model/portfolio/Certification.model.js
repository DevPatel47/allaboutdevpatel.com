export default class Certification {
    /**
     * Constructs a Certification instance.
     * @param {Object} param0
     * @param {string|null} param0._id
     * @param {string} param0.userId
     * @param {string} param0.title
     * @param {string} param0.provider
     * @param {string} param0.issueDate
     * @param {string} param0.credentialId
     * @param {string} param0.credentialUrl
     * @param {string} [param0.badgeImage='']
     * @param {string} [param0.createdAt='']
     * @param {string} [param0.updatedAt='']
     */
    constructor({
        _id = null,
        userId,
        title,
        provider,
        issueDate,
        credentialId,
        credentialUrl,
        badgeImage = '',
        createdAt = '',
        updatedAt = '',
    } = {}) {
        this._id = _id;
        this.userId = userId;
        this.title = title;
        this.provider = provider;
        this.issueDate = issueDate;
        this.credentialId = credentialId;
        this.credentialUrl = credentialUrl;
        this.badgeImage = badgeImage;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    toJSON() {
        return {
            _id: this._id,
            userId: this.userId,
            title: this.title,
            provider: this.provider,
            issueDate: this.issueDate,
            credentialId: this.credentialId,
            credentialUrl: this.credentialUrl,
            badgeImage: this.badgeImage,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}
