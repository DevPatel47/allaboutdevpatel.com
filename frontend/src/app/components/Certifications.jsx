import React from 'react';
import PropTypes from 'prop-types';
import { AnimatedBlurDots } from './components.js';

/**
 * Certifications Component
 * Renders a visually appealing and responsive Certifications section.
 * @param {Object} props
 * @param {Array} props.certifications - Array of certification objects.
 * @returns {JSX.Element}
 */
function Certifications({ certifications = [] }) {
    if (!certifications.length) return null;

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
                <h3 className="heading-section mb-6 text-zinc-900 dark:text-zinc-50 text-center lg:text-left tracking-tight drop-shadow transition-all duration-300">
                    🏅 My Certifications
                </h3>
                <div className="w-full max-w-2xl lg:max-w-5xl flex flex-col items-center gap-6">
                    {certifications.map((cert, index) => (
                        <div
                            key={cert._id || index}
                            className="
                                flex flex-col md:flex-row items-center gap-4 w-full
                                p-6 bg-zinc-50/95 dark:bg-zinc-900/90 rounded-3xl
                                shadow-md hover:shadow-lg transition-shadow duration-300
                                border border-zinc-200 dark:border-zinc-800
                                relative z-10
                            "
                        >
                            {cert.badgeImage && (
                                <img
                                    src={cert.badgeImage}
                                    alt={cert.title}
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
                            )}
                            <div className="flex-1 flex flex-col items-center md:items-start">
                                <h4 className="heading-card mb-1 text-center md:text-left transition-all duration-300">
                                    {cert.title}
                                </h4>
                                <p className="text-body mb-1 text-center md:text-left">
                                    {cert.provider}
                                </p>
                                <p className="text-meta mb-2 text-center md:text-left">
                                    {cert.issueDate &&
                                        new Date(cert.issueDate).toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                        })}
                                </p>
                                {cert.credentialUrl && (
                                    <a
                                        href={cert.credentialUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="link-blue break-all"
                                    >
                                        View Credential
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

Certifications.propTypes = {
    certifications: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            title: PropTypes.string.isRequired,
            provider: PropTypes.string,
            issueDate: PropTypes.string,
            credentialUrl: PropTypes.string,
            badgeImage: PropTypes.string,
        }),
    ),
};

export default Certifications;
