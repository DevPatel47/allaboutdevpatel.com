/**
 * ShineTextBg Component
 *
 * Renders a large, theme-aware, animated shine text background.
 * Uses custom CSS classes for light/dark shine effects.
 *
 * @module ShineTextBg
 */

import React from 'react';
import PropTypes from 'prop-types';
import useTheme from '../contexts/theme.js';

/**
 * ShineTextBg component for animated background text.
 * @param {Object} props
 * @param {string} props.text - The text to display with shine effect.
 * @returns {JSX.Element}
 */
function ShineTextBg({ text }) {
    const { themeMode } = useTheme();

    return (
        <div className="absolute flex justify-center items-center w-full h-screen z-15 pointer-events-none select-none">
            <h1 className="text-7xl sm:text-[130px] lg:text-[200px] xl:text-[300px] font-extrabold font-poiret text-zinc-950/75 dark:text-zinc-200/20 text-center relative overflow-hidden select-none">
                <span
                    className={themeMode === 'dark' ? 'shine-text-dark' : 'shine-text-light'}
                    aria-hidden="true"
                >
                    {text}
                </span>
            </h1>
        </div>
    );
}

ShineTextBg.propTypes = {
    text: PropTypes.string.isRequired,
};

export default ShineTextBg;
