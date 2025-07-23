export default class Testimonial {
    /**
     * Constructs a Testimonial instance.
     * @param {Object} param0
     * @param {string|null} param0._id
     * @param {string} param0.userId
     * @param {string} param0.name
     * @param {string} param0.role
     * @param {string} param0.content
     * @param {string} [param0.image='']
     * @param {string} [param0.linkedIn='']
     * @param {string} [param0.createdAt='']
     * @param {string} [param0.updatedAt='']
     */
    constructor({
        _id = null,
        userId,
        name,
        role,
        content,
        image = '',
        linkedIn = '',
        createdAt = '',
        updatedAt = ''
    } = {}) {
        this._id = _id;
        this.userId = userId;
        this.name = name;
        this.role = role;
        this.content = content;
        this.image = image;
        this.linkedIn = linkedIn;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    toJSON() {
        return {
            _id: this._id,
            userId: this.userId,
            name: this.name,
            role: this.role,
            content: this.content,
            image: this.image,
            linkedIn: this.linkedIn,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}