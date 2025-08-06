/**
 * Logo Component
 *
 * Renders the site logo as a styled link to the homepage.
 * Uses accessible markup and adapts to dark/light themes.
 *
 * @module Logo
 */

import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Logo component for the application.
 * @returns {JSX.Element}
 */
function Logo() {
    return (
        <Link
            className="
                w-36 h-16
                relative flex items-center justify-center
                m-8 shrink-0
            "
            to="/"
            aria-label="Homepage"
        >
            <h1
                className="
                    absolute
                    text-6xl font-bold
                    text-zinc-900/30 dark:text-zinc-50/30 mb-3
                    select-none
                "
                aria-hidden="true"
            >
                {'</>'}
            </h1>
            <h2
                className="
                    absolute
                    text-md font-black tracking-widest
                    text-zinc-900 dark:text-zinc-50
                    select-none
                "
            >
                {'THE { DEV }'}
            </h2>
        </Link>
    );
}

export default Logo;
