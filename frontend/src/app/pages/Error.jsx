/**
 * Error Component
 *
 * Displays a full-page error message with a background image.
 * Intended for use as a fallback or error boundary UI.
 *
 * @module Error
 */

import React from 'react';
import PropTypes from 'prop-types';
import { BgImage } from '../components/components.js';

/**
 * Error component for displaying error messages.
 *
 * @param {Object} props
 * @param {string} props.errorMessage - The error message to display.
 * @returns {JSX.Element}
 */
function Error({ errorMessage }) {
    return (
        <>
            <BgImage />
            <div className="absolute flex justify-center items-center w-full h-screen z-20 p-20">
                <h1
                    className="
                        text-4xl md:text-6xl lg:text-7xl
                        font-extrabold font-poiret
                        text-zinc-700/75 dark:text-zinc-200/75
                        relative z-10
                        drop-shadow-2xl text-center
                    "
                    role="alert"
                    aria-live="assertive"
                >
                    {errorMessage}
                </h1>
            </div>
        </>
    );
}

Error.propTypes = {
    errorMessage: PropTypes.string.isRequired,
};

export default Error;
