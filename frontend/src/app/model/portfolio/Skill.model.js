export default class Skill {
    /**
     * Constructs a Skill instance.
     * @param {Object} param0
     * @param {string|null} param0._id
     * @param {string} param0.userId
     * @param {string} param0.category
     * @param {Array<{name: string, level: string}>} [param0.skills=[]]
     * @param {string} [param0.createdAt='']
     * @param {string} [param0.updatedAt='']
     */
    constructor({
        _id = null,
        userId,
        category,
        skills = [],
        createdAt = '',
        updatedAt = ''
    } = {}) {
        this._id = _id;
        this.userId = userId;
        this.category = category;
        this.skills = skills;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    toJSON() {
        return {
            _id: this._id,
            userId: this.userId,
            category: this.category,
            skills: this.skills,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}