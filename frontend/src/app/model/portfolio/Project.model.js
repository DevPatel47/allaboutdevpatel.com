export default class Project {
    /**
     * Constructs a Project instance.
     * @param {Object} param0
     * @param {string|null} param0._id
     * @param {string} param0.userId
     * @param {string} param0.title
     * @param {string} param0.slug
     * @param {string} param0.description
     * @param {string[]} [param0.techStack=[]]
     * @param {string} [param0.image='']
     * @param {string} [param0.video='']
     * @param {string} [param0.liveLink='']
     * @param {string} [param0.repoLink='']
     * @param {string[]} [param0.tags=[]]
     * @param {boolean} [param0.featured=false]
     * @param {string} [param0.createdAt='']
     * @param {string} [param0.updatedAt='']
     */
    constructor({
        _id = null,
        userId,
        title,
        slug,
        description,
        techStack = [],
        image = '',
        video = '',
        liveLink = '',
        repoLink = '',
        tags = [],
        featured = false,
        createdAt = '',
        updatedAt = ''
    } = {}) {
        this._id = _id;
        this.userId = userId;
        this.title = title;
        this.slug = slug;
        this.description = description;
        this.techStack = techStack;
        this.image = image;
        this.video = video;
        this.liveLink = liveLink;
        this.repoLink = repoLink;
        this.tags = tags;
        this.featured = featured;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    toJSON() {
        return {
            _id: this._id,
            userId: this.userId,
            title: this.title,
            slug: this.slug,
            description: this.description,
            techStack: this.techStack,
            image: this.image,
            video: this.video,
            liveLink: this.liveLink,
            repoLink: this.repoLink,
            tags: this.tags,
            featured: this.featured,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}