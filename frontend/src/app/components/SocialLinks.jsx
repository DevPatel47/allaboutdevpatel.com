/**
 * SocialLinks Component
 *
 * Renders a vertical or horizontal list of social media links with brand icons.
 * Responsive, accessible, and theme-aware.
 *
 * @module SocialLinks
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as brands from '@fortawesome/free-brands-svg-icons';

/**
 * Returns the FontAwesome brand icon for a given icon name.
 * @param {string} iconName
 * @returns {object|null}
 */
function getBrandIcon(iconName) {
    return brands[iconName] || null;
}

/**
 * SocialLinks component for displaying social media links.
 * @param {Object} props
 * @param {Array} props.socialLinks - Array of social link objects.
 * @returns {JSX.Element|null}
 */
function SocialLinks({ socialLinks = [] }) {
    if (!Array.isArray(socialLinks) || socialLinks.length === 0) return null;

    return (
        <div className="flex justify-center mt-4">
            <div
                className="
                    md:fixed md:right-4 md:top-1/2 md:transform md:-translate-y-1/2
                    transition-all duration-300
                    flex md:flex-col items-center justify-center
                    gap-6 mt-6
                    p-4
                    z-[100]
                    bg-zinc-50 dark:bg-zinc-950
                    rounded-lg shadow-lg
                "
                role="navigation"
                aria-label="Social media links"
            >
                {socialLinks.map((link, index) => {
                    const icon = getBrandIcon(link.icon);
                    return (
                        <a
                            key={index}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="
                                text-zinc-700 dark:text-zinc-200
                                hover:text-zinc-900 dark:hover:text-zinc-50
                                transition-colors duration-300
                                flex items-center justify-center
                                min-w-[40px] min-h-[40px]
                            "
                            aria-label={link.platform || link.icon || 'Social link'}
                        >
                            {icon ? (
                                <FontAwesomeIcon icon={icon} size="2x" />
                            ) : (
                                <span className="text-base font-semibold">
                                    {link.platform || 'Link'}
                                </span>
                            )}
                        </a>
                    );
                })}
            </div>
        </div>
    );
}

SocialLinks.propTypes = {
    socialLinks: PropTypes.arrayOf(
        PropTypes.shape({
            icon: PropTypes.string,
            url: PropTypes.string.isRequired,
            platform: PropTypes.string,
        }),
    ),
};

export default SocialLinks;
