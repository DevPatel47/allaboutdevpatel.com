/**
 * Footer Component
 *
 * Displays the site footer with copyright.
 * Responsive and accessible.
 *
 * @module Footer
 */

import React from 'react';

/**
 * Footer component for the application.
 * @returns {JSX.Element}
 */
function Footer() {
    return (
        <footer
            className="
                container mx-auto h-20 z-50 flex items-center justify-center
                text-center text-sm text-zinc-600 dark:text-zinc-400
                select-none
            "
            role="contentinfo"
        >
            <p>© {new Date().getFullYear()} Dev&apos;s Portfolio. All rights reserved.</p>
        </footer>
    );
}

export default Footer;
