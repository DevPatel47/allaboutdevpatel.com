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

    const levelColorMap = {
        Beginner:
            'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200 border border-amber-200 dark:border-amber-700',
        Intermediate:
            'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200 border border-blue-200 dark:border-blue-700',
        Advanced:
            'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-700',
    };

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
                <h3 className="heading-section mb-6 text-zinc-900 dark:text-zinc-50 text-center tracking-tight drop-shadow transition-all duration-300">
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
                            <span className="heading-card mb-1 text-center md:text-left transition-all duration-300">
                                {category.category}
                            </span>
                            <div className="flex flex-wrap gap-3 justify-center w-full">
                                {category.skills.map((skill) => {
                                    const levelClasses =
                                        levelColorMap[skill.level] ||
                                        'bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-600';
                                    return (
                                        <span
                                            key={skill._id}
                                            className="
                                                px-3 py-1 rounded-lg font-mono text-sm md:text-base
                                                bg-zinc-100 dark:bg-zinc-800
                                                text-zinc-800 dark:text-zinc-100
                                                border border-zinc-200 dark:border-zinc-700
                                                transition-all duration-300 flex items-center gap-2
                                                hover:bg-zinc-200 dark:hover:bg-zinc-700
                                            "
                                        >
                                            {skill.name}
                                            <span
                                                className={`text-xs font-semibold tracking-tight px-2 py-0.5 rounded-md transition-colors duration-300 ${levelClasses}`}
                                            >
                                                {skill.level}
                                            </span>
                                        </span>
                                    );
                                })}
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
