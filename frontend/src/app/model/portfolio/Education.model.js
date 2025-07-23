export default class Education {
    /**
     * Constructs an Education instance.
     * @param {Object} param0
     * @param {string|null} param0._id
     * @param {string} param0.userId
     * @param {string} param0.institution
     * @param {string} param0.degree
     * @param {string} param0.fieldOfStudy
     * @param {string} param0.startDate
     * @param {string} param0.endDate
     * @param {string} param0.grade
     * @param {string} param0.description
     * @param {string} [param0.logo='']
     * @param {string} [param0.createdAt='']
     * @param {string} [param0.updatedAt='']
     */
    constructor({
        _id = null,
        userId,
        institution,
        degree,
        fieldOfStudy,
        startDate,
        endDate,
        grade,
        description,
        logo = '',
        createdAt = '',
        updatedAt = '',
    } = {}) {
        this._id = _id;
        this.userId = userId;
        this.institution = institution;
        this.degree = degree;
        this.fieldOfStudy = fieldOfStudy;
        this.startDate = startDate;
        this.endDate = endDate;
        this.grade = grade;
        this.description = description;
        this.logo = logo;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    toJSON() {
        return {
            _id: this._id,
            userId: this.userId,
            institution: this.institution,
            degree: this.degree,
            fieldOfStudy: this.fieldOfStudy,
            startDate: this.startDate,
            endDate: this.endDate,
            grade: this.grade,
            description: this.description,
            logo: this.logo,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}
