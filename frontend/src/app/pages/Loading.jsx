/**
 * Loading Component
 *
 * Displays a full-page loading message with a background image.
 * Intended for use as a loading/fallback UI.
 *
 * @module Loading
 */

import React from 'react';
import PropTypes from 'prop-types';
import { BgImage } from '../components/components.js';

/**
 * Loading component for displaying loading messages.
 *
 * @param {Object} props
 * @param {string} props.loadingMessage - The loading message to display.
 * @returns {JSX.Element}
 */
function Loading({ loadingMessage }) {
    return (
        <>
            <BgImage />
            <div className="absolute flex justify-center items-center w-full h-screen z-20 p-20">
                <h1
                    className="heading-hero text-zinc-700/75 dark:text-zinc-200/75 drop-shadow-2xl text-center animate-pulse"
                    role="status"
                    aria-live="polite"
                >
                    {loadingMessage}
                </h1>
            </div>
        </>
    );
}

Loading.propTypes = {
    loadingMessage: PropTypes.string.isRequired,
};

export default Loading;
