export default class Introduction {
    /**
     * Constructs an Introduction instance.
     * @param {Object} param0 - The introduction data object.
     * @param {string|null} param0._id
     * @param {string} param0.userId
     * @param {string} param0.greeting
     * @param {string} param0.name
     * @param {string} param0.tagline
     * @param {string} param0.description
     * @param {string} [param0.profileImage='']
     * @param {string} [param0.resume='']
     * @param {string} [param0.createdAt='']
     * @param {string} [param0.updatedAt='']
     */
    constructor({
        _id = null,
        userId,
        greeting,
        name,
        tagline,
        description,
        profileImage = '',
        resume = '',
        createdAt = '',
        updatedAt = ''
    } = {}) {
        this._id = _id;
        this.userId = userId;
        this.greeting = greeting;
        this.name = name;
        this.tagline = tagline;
        this.description = description;
        this.profileImage = profileImage;
        this.resume = resume;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    toJSON() {
        return {
            _id: this._id,
            userId: this.userId,
            greeting: this.greeting,
            name: this.name,
            tagline: this.tagline,
            description: this.description,
            profileImage: this.profileImage,
            resume: this.resume,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}