export default class Experience {
    /**
     * Constructs an Experience instance.
     * @param {Object} param0
     * @param {string|null} param0._id
     * @param {string} param0.userId
     * @param {string} param0.title
     * @param {string} param0.company
     * @param {string} param0.location
     * @param {string} param0.startDate
     * @param {string} param0.endDate
     * @param {string[]} [param0.responsibilities=[]]
     * @param {string[]} [param0.techStack=[]]
     * @param {string} [param0.logo='']
     * @param {string} [param0.createdAt='']
     * @param {string} [param0.updatedAt='']
     */
    constructor({
        _id = null,
        userId,
        title,
        company,
        location,
        startDate,
        endDate,
        responsibilities = [],
        techStack = [],
        logo = '',
        createdAt = '',
        updatedAt = ''
    } = {}) {
        this._id = _id;
        this.userId = userId;
        this.title = title;
        this.company = company;
        this.location = location;
        this.startDate = startDate;
        this.endDate = endDate;
        this.responsibilities = responsibilities;
        this.techStack = techStack;
        this.logo = logo;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    toJSON() {
        return {
            _id: this._id,
            userId: this.userId,
            title: this.title,
            company: this.company,
            location: this.location,
            startDate: this.startDate,
            endDate: this.endDate,
            responsibilities: this.responsibilities,
            techStack: this.techStack,
            logo: this.logo,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}