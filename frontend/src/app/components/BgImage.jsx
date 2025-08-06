/**
 * BgImage Component
 *
 * Renders a fixed background image for the application.
 * The image is styled to be non-interactive and adapts to dark/light themes.
 *
 * @module BgImage
 */

import React from 'react';
import bg from '../../assets/bg-dark.jpg';

/**
 * Background image component for layout backgrounds.
 * @returns {JSX.Element}
 */
const BgImage = () => (
    <div
        className="
            absolute top-0 left-0 w-full h-[100vh] z-0 pointer-events-none select-none
            overflow-hidden
        "
        style={{ minHeight: '100vh', maxHeight: '100vh' }}
        aria-hidden="true"
        tabIndex={-1}
        role="presentation"
    >
        <img
            src={bg}
            alt=""
            className="
                w-full h-full object-cover
                invert dark:invert-0 inset-shadow-b-2xl scale-x-[-1]
                transition-all duration-300
            "
            draggable={false}
            aria-hidden="true"
            tabIndex={-1}
        />
    </div>
);

export default BgImage;
