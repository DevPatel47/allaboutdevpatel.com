import React from 'react';
import PropTypes from 'prop-types';
import { AnimatedBlurDots } from './components.js';

/**
 * Skills Component
 * Renders a visually appealing and responsive Skills section.
 * @param {Object} props
 * @param {Array} props.skills - Array of skill category objects.
 * @returns {JSX.Element}
 */
function Skills({ skills = [] }) {
    if (!skills.length) return null;

    return (
        <section
            className="
                w-full flex items-center justify-center
                bg-zinc-50 dark:bg-zinc-950
                px-4 pt-16 relative
                transition-all duration-300
            "
            aria-label="Skills Section"
        >
            <AnimatedBlurDots count={16} />
            <div
                className="
                    relative z-0 p-6
                    flex flex-col
                    items-center
                    w-full max-w-2xl lg:max-w-5xl
                    transition-all duration-300
                "
            >
                <h3
                    className="
                        text-4xl md:text-5xl font-extrabold font-poiret mb-6
                        text-zinc-900 dark:text-zinc-50
                        text-center tracking-tight drop-shadow
                        transition-all duration-300
                    "
                >
                    🛠️ Skills
                </h3>
                <div className="w-full flex flex-col gap-6">
                    {skills.map((category) => (
                        <div
                            key={category._id}
                            className="
                                flex flex-col items-center gap-4 w-full
                                p-6 bg-zinc-50/95 dark:bg-zinc-900/90 rounded-3xl
                                shadow-md hover:shadow-lg transition-shadow duration-300
                                border border-zinc-200 dark:border-zinc-800
                                relative z-10
                            "
                        >
                            <span
                                className="
                                    font-bold text-lg md:text-2xl text-blue-900 dark:text-blue-200 mb-1 text-center md:text-left transition-all duration-300
                                "
                            >
                                {category.category}
                            </span>
                            <div className="flex flex-wrap gap-3 justify-center w-full">
                                {category.skills.map((skill) => (
                                    <span
                                        key={skill._id}
                                        className={`
                                            px-3 py-1 rounded-lg font-mono text-sm md:text-base
                                            bg-indigo-100 dark:bg-indigo-900
                                            text-indigo-900 dark:text-indigo-100
                                            border border-indigo-200 dark:border-indigo-800
                                            transition-all duration-300
                                            flex items-center gap-2
                                        `}
                                    >
                                        {skill.name}
                                        <span
                                            className={`
                                                text-xs px-2 py-0.5 rounded
                                                ${
                                                    skill.level === 'Beginner'
                                                        ? 'bg-pink-200 dark:bg-pink-800 text-pink-800 dark:text-pink-200'
                                                        : skill.level === 'Intermediate'
                                                          ? 'bg-orange-200 dark:bg-orange-800 text-orange-800 dark:text-orange-200'
                                                          : 'bg-cyan-200 dark:bg-cyan-800 text-cyan-800 dark:text-cyan-200'
                                                }
                                            `}
                                        >
                                            {skill.level}
                                        </span>
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

Skills.propTypes = {
    skills: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            category: PropTypes.string.isRequired,
            skills: PropTypes.arrayOf(
                PropTypes.shape({
                    _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
                    name: PropTypes.string.isRequired,
                    level: PropTypes.oneOf(['Beginner', 'Intermediate', 'Advanced']).isRequired,
                }),
            ).isRequired,
        }),
    ),
};

export default Skills;
