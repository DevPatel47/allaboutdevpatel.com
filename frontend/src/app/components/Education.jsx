import React from 'react';
import PropTypes from 'prop-types';
import doodleImg from '../../assets/education-doodle.png';
import { AnimatedBlurDots } from './index.js';

/**
 * Education Component
 * Renders a visually appealing and responsive Education section.
 * @param {Object} props
 * @param {Array} props.education - Array of education objects.
 * @returns {JSX.Element}
 */
function Education({ education = [] }) {
    if (!education.length) return null;

    return (
        <section
            className="
                w-full flex items-center justify-center
                bg-zinc-50 dark:bg-zinc-950
                px-4 pt-16 relative
                transition-all duration-300
            "
            aria-label="Education Section"
        >
            
            <AnimatedBlurDots count={20} />
            <div
                className="
                    relative z-0 p-6    
                    flex flex-col lg:flex-row
                    items-center md:items-center
                    justify-between
                    w-full max-w-5xl
                    lg:gap-20
                    transition-all duration-300
                "
            >
                {/* Doodle Image on the left */}
                <div
                    className="
                        flex-shrink-0 flex flex-col items-center justify-center
                        h-full
                        transition-all duration-300
                        relative z-0
                    "
                >   
                    <h3
                        className="
                            lg:hidden
                            text-4xl md:text-5xl font-extrabold font-poiret mb-6
                            text-zinc-900 dark:text-zinc-50
                            text-center md:text-left tracking-tight drop-shadow
                            transition-all duration-300
                        "
                    >
                        Education
                    </h3>
                    <div className="relative group transition-all duration-300 ">
                        <img
                            src={doodleImg}
                            alt="Education Doodle"
                            className="
                                w-72 h-72 sm:w-[22rem] sm:h-[22rem] md:w-[24rem] md:h-[24rem]
                                object-cover
                                transition-all duration-300 hover:scale-105 
                                dark:invert 
                                z-0 
                            "
                            loading="lazy"
                            draggable="false"
                        />
                    </div>
                </div>
                {/* Education Content */}
                <div
                    className="
                        flex-1 flex flex-col justify-center
                        items-center md:items-start
                        w-full max-w-2xl h-full
                        transition-all duration-300
                    "
                >
                    <h3
                        className="
                            hidden lg:block
                            text-4xl md:text-5xl font-extrabold font-poiret mb-6
                            text-zinc-900 dark:text-zinc-50
                            text-center md:text-left tracking-tight drop-shadow
                            transition-all duration-300
                        "
                    >
                        Education
                    </h3>
                    <div
                        className="
                            flex flex-col gap-6
                            w-full
                            transition-all duration-300
                        "
                    >
                        {education.map((edu, index) => (
                            <div
                                key={edu._id || index}
                                className="
                                    flex flex-col md:flex-row items-center md:items-start gap-4
                                    p-6 bg-zinc-50/95 dark:bg-zinc-900/90 rounded-3xl
                                    shadow-md hover:shadow-lg transition-shadow duration-300
                                    border border-zinc-200 dark:border-zinc-800
                                    relative z-10
                                "
                            >
                                {/* Institution Logo */}
                                {edu.logo && (
                                    <img
                                        src={edu.logo}
                                        alt={edu.institution}
                                        className="
                                            w-16 h-16 object-cover rounded-xl
                                            border border-zinc-200 dark:border-zinc-700
                                            mr-0 md:mr-4 mb-2 md:mb-0
                                        "
                                        loading="lazy"
                                        draggable="false"
                                    />
                                )}
                                <div className="flex-1 flex flex-col">
                                    <h4
                                        className="
                                            text-2xl md:text-3xl font-bold
                                            mb-2 md:mb-4
                                            text-blue-900 dark:text-blue-200
                                            transition-all duration-300
                                        "
                                    >
                                        {edu.degree}
                                    </h4>
                                    <p
                                        className="
                                            text-sm md:text-base text-zinc-800 dark:text-zinc-100
                                            mb-2
                                            font-semibold
                                            transition-all duration-300
                                        "
                                    >
                                        {edu.institution}
                                        {edu.fieldOfStudy && (
                                            <span className="ml-2 text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                                                {edu.fieldOfStudy}
                                            </span>
                                        )}
                                    </p>
                                    <p
                                        className="
                                            text-xs text-zinc-600 dark:text-zinc-400 font-mono mb-2
                                            transition-all duration-300
                                        "
                                    >
                                        {new Date(edu.startDate).toLocaleDateString()} -{' '}
                                        {new Date(edu.endDate).toLocaleDateString()}
                                        {edu.grade && (
                                            <>
                                                {' '}
                                                | Grade:{' '}
                                                <span className="font-semibold">{edu.grade}</span>
                                            </>
                                        )}
                                    </p>
                                    <p
                                        className="
                                            text-sm md:text-base text-zinc-600 dark:text-zinc-400
                                            transition-all duration-300
                                        "
                                    >
                                        {edu.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

Education.propTypes = {
    education: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            logo: PropTypes.string,
            institution: PropTypes.string.isRequired,
            degree: PropTypes.string.isRequired,
            fieldOfStudy: PropTypes.string,
            startDate: PropTypes.string.isRequired,
            endDate: PropTypes.string.isRequired,
            grade: PropTypes.string,
            description: PropTypes.string,
        })
    ),
};

export default Education;
