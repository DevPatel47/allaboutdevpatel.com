import React from 'react';
import PropTypes from 'prop-types';
import { AnimatedBlurDots } from './components.js';

function WorkExperience({ experience = [] }) {
    if (!experience.length) return null;

    return (
        <section
            className="
                w-full flex items-center justify-center
                bg-zinc-50 dark:bg-zinc-950
                px-4 pt-16 relative
                transition-all duration-300
            "
            aria-label="Work Experience Section"
        >
            <AnimatedBlurDots count={18} />
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
                        text-center lg:text-left tracking-tight drop-shadow
                        transition-all duration-300
                    "
                >
                    💼 Work Experience
                </h3>
                <div className="w-full flex flex-col gap-6">
                    {experience.map((exp, index) => (
                        <div
                            key={exp._id || index}
                            className="
                                flex flex-col md:flex-row items-center md:items-start gap-4 w-full
                                p-6 bg-zinc-50/95 dark:bg-zinc-900/90 rounded-3xl
                                shadow-md hover:shadow-lg transition-shadow duration-300
                                border border-zinc-200 dark:border-zinc-800
                                relative z-10
                            "
                        >
                            {exp.logo && (
                                <img
                                    src={exp.logo}
                                    alt={exp.company}
                                    className="
                                        w-16 h-16 object-cover rounded-xl
                                        border border-zinc-200 dark:border-zinc-700
                                        mr-0 md:mr-4 mb-2 md:mb-0
                                    "
                                    loading="lazy"
                                    draggable="false"
                                />
                            )}
                            <div className="flex-1 flex flex-col items-center md:items-start">
                                <h4
                                    className="
                                        font-bold text-lg md:text-2xl text-blue-900 dark:text-blue-200
                                        mb-1 text-center md:text-left transition-all duration-300
                                    "
                                >
                                    {exp.title}
                                </h4>
                                <p
                                    className="
                                        text-sm md:text-base text-zinc-800 dark:text-zinc-100
                                        mb-1 font-semibold text-center md:text-left
                                        transition-all duration-300
                                    "
                                >
                                    {exp.company}
                                    {exp.location && (
                                        <span className="ml-2 text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                                            {exp.location}
                                        </span>
                                    )}
                                </p>
                                <p
                                    className="
                                        text-xs text-zinc-600 dark:text-zinc-400 font-mono mb-2
                                        text-center md:text-left transition-all duration-300
                                    "
                                >
                                    {new Date(exp.startDate).toLocaleDateString()} -{' '}
                                    {exp.endDate
                                        ? new Date(exp.endDate).toLocaleDateString()
                                        : 'Present'}
                                </p>
                                {Array.isArray(exp.responsibilities) &&
                                    exp.responsibilities.length > 0 && (
                                        <ul
                                            className="
                                            list-disc list-inside
                                            text-sm md:text-base text-zinc-600 dark:text-zinc-400
                                            mb-2 space-y-1
                                        "
                                        >
                                            {exp.responsibilities.map((r, i) => (
                                                <li key={i}>{r}</li>
                                            ))}
                                        </ul>
                                    )}
                                {Array.isArray(exp.techStack) && exp.techStack.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {exp.techStack.map((tech, i) => (
                                            <span
                                                key={i}
                                                className="
                                                    text-xs font-mono
                                                    bg-zinc-200 dark:bg-zinc-800
                                                    text-zinc-700 dark:text-zinc-200
                                                    px-2 py-1 rounded
                                                "
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

WorkExperience.propTypes = {
    experience: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            title: PropTypes.string.isRequired,
            company: PropTypes.string.isRequired,
            location: PropTypes.string,
            startDate: PropTypes.string.isRequired,
            endDate: PropTypes.string,
            responsibilities: PropTypes.arrayOf(PropTypes.string),
            techStack: PropTypes.arrayOf(PropTypes.string),
            logo: PropTypes.string,
        }),
    ),
};

export default WorkExperience;
