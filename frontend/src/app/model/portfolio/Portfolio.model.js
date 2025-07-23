/**
 * Portfolio model for frontend.
 * Aggregates all portfolio sections for a user.
 */
export default class Portfolio {
    /**
     * Constructs a Portfolio instance.
     * @param {Object} param0
     * @param {Object} param0.user - User object.
     * @param {Object} [param0.introduction={}] - Introduction object.
     * @param {Array} [param0.skills=[]] - Array of Skill objects.
     * @param {Array} [param0.projects=[]] - Array of Project objects.
     * @param {Array} [param0.education=[]] - Array of Education objects.
     * @param {Array} [param0.experience=[]] - Array of Experience objects.
     * @param {Array} [param0.certifications=[]] - Array of Certification objects.
     * @param {Array} [param0.socialLinks=[]] - Array of SocialLink objects.
     * @param {Array} [param0.testimonials=[]] - Array of Testimonial objects.
     */
    constructor({
        user,
        introduction = {},
        skills = [],
        projects = [],
        education = [],
        experience = [],
        certifications = [],
        socialLinks = [],
        testimonials = [],
    } = {}) {
        this.user = user;
        this.introduction = introduction;
        this.skills = skills;
        this.projects = projects;
        this.education = education;
        this.experience = experience;
        this.certifications = certifications;
        this.socialLinks = socialLinks;
        this.testimonials = testimonials;
    }

    /**
     * Converts the Portfolio instance to a plain object for serialization.
     * @returns {Object} - The JSON representation of the portfolio.
     */
    toJSON() {
        return {
            user: this.user,
            introduction: this.introduction,
            skills: this.skills,
            projects: this.projects,
            education: this.education,
            experience: this.experience,
            certifications: this.certifications,
            socialLinks: this.socialLinks,
            testimonials: this.testimonials,
        };
    }
}
