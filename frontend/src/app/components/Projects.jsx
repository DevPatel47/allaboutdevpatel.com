import React from 'react';
import PropTypes from 'prop-types';
import { AnimatedBlurDots } from './components.js';

/**
 * ProjectsSection Component
 * Modern horizontal spotlight design: alternating layout, glassmorphism, animated border, floating number.
 */
function Projects({ projects = [] }) {
    if (!projects.length) return null;

    return (
        <section
            className="
                        w-full flex items-center justify-center
                        bg-zinc-50 dark:bg-zinc-950
                        px-4 pt-16 relative
                        transition-all duration-300
                    "
            aria-label="Certifications Section"
        >
            <AnimatedBlurDots count={20} />
            <div
                className="
                    relative z-0 p-6    
                    flex flex-col
                    items-center md:items-center
                    justify-between
                    w-full max-w-5xl
                    transition-all duration-300
                "
            >
                {/* Heading */}
                <h3
                    className="
                        text-4xl md:text-5xl font-extrabold font-poiret mb-6
                        text-zinc-900 dark:text-zinc-50
                        text-center lg:text-left tracking-tight drop-shadow
                        transition-all duration-300
                    "
                >
                    🚀 Projects
                </h3>
                <div className="w-full max-w-2xl lg:max-w-5xl flex flex-col items-center gap-6">
                    {projects.map((project, index) => (
                        <div
                            key={project._id || index}
                            className="
                flex flex-col md:flex-row items-center gap-4 w-full
                p-6 bg-zinc-50/95 dark:bg-zinc-900/90 rounded-3xl
                shadow-md hover:shadow-lg transition-shadow duration-300
                border border-zinc-200 dark:border-zinc-800
                relative z-10
            "
                        >
                            {project.image && (
                                <a
                                    href={project.liveLink || project.repoLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full md:w-[320px] flex-shrink-0"
                                    draggable="false"
                                >
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                        className="
                            w-full md:w-[320px] object-contain
                            rounded-xl border border-zinc-200 dark:border-zinc-700
                            bg-white dark:bg-zinc-900
                            mb-4 md:mb-0
                            transition-all duration-300
                        "
                                        loading="lazy"
                                        draggable="false"
                                    />
                                </a>
                            )}
                            <div className="flex-1 flex flex-col items-center md:items-start">
                                <h4 className="font-bold text-lg md:text-2xl text-blue-900 dark:text-blue-200 mb-1 text-center md:text-left transition-all duration-300">
                                    {project.title}
                                </h4>
                                <p className="text-sm md:text-base text-zinc-700 dark:text-zinc-300 mb-1 text-center md:text-left">
                                    {project.description}
                                </p>
                                {project.techStack && project.techStack.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {project.techStack.map((tech, i) => (
                                            <span
                                                key={i}
                                                className="text-xs font-mono bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 px-2 py-1 rounded"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                {project.tags && project.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {project.tags.map((tag, i) => (
                                            <span
                                                key={i}
                                                className="text-xs font-mono bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 px-2 py-1 rounded"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                <div className="flex gap-4 mt-2">
                                    {project.liveLink && (
                                        <a
                                            href={project.liveLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-green-700 dark:text-green-300 underline"
                                        >
                                            Live Demo
                                        </a>
                                    )}
                                    {project.repoLink && (
                                        <a
                                            href={project.repoLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-blue-700 dark:text-blue-300 underline"
                                        >
                                            Source Code
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

Projects.propTypes = {
    projects: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
            image: PropTypes.string,
            liveLink: PropTypes.string,
            repoLink: PropTypes.string,
            techStack: PropTypes.arrayOf(PropTypes.string),
            tags: PropTypes.arrayOf(PropTypes.string),
        }),
    ),
};

export default Projects;
