/**
 * TypewriterArray Component
 *
 * Animates an array of strings with a typewriter effect, cycling through each string.
 * Supports configurable typing speed, deleting speed, and pause duration.
 *
 * @module TypewriterArray
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

/**
 * TypewriterArray component for animated typewriter text.
 * @param {Object} props
 * @param {string[]} props.texts - Array of strings to animate.
 * @param {number} [props.typingSpeed=150] - Typing speed in ms per character.
 * @param {number} [props.deletingSpeed=50] - Deleting speed in ms per character.
 * @param {number} [props.pauseBeforeDelete=800] - Pause before deleting in ms.
 * @param {string} [props.className] - Additional CSS classes.
 * @returns {JSX.Element}
 */
const TypewriterArray = ({
    texts = [],
    typingSpeed = 150,
    deletingSpeed = 50,
    pauseBeforeDelete = 800,
    className = '',
}) => {
    const [textIndex, setTextIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        if (!Array.isArray(texts) || texts.length === 0) return;

        const currentText = texts[textIndex % texts.length];
        let timeout;

        if (!isDeleting && charIndex < currentText.length) {
            // Typing
            timeout = setTimeout(() => {
                setDisplayedText(currentText.slice(0, charIndex + 1));
                setCharIndex(charIndex + 1);
            }, typingSpeed);
        } else if (!isDeleting && charIndex === currentText.length) {
            // Pause before deleting
            timeout = setTimeout(() => {
                setIsDeleting(true);
            }, pauseBeforeDelete);
        } else if (isDeleting && charIndex > 0) {
            // Deleting
            timeout = setTimeout(() => {
                setDisplayedText(currentText.slice(0, charIndex - 1));
                setCharIndex(charIndex - 1);
            }, deletingSpeed);
        } else if (isDeleting && charIndex === 0) {
            // Move to next word
            setIsDeleting(false);
            setTextIndex((prev) => (prev + 1) % texts.length);
        }

        return () => clearTimeout(timeout);
    }, [charIndex, isDeleting, textIndex, texts, typingSpeed, deletingSpeed, pauseBeforeDelete]);

    if (!Array.isArray(texts) || texts.length === 0) return null;

    return (
        <div className={className} aria-live="polite" aria-atomic="true">
            {displayedText}
            <span className="animate-pulse ml-1" aria-hidden="true">
                |
            </span>
        </div>
    );
};

TypewriterArray.propTypes = {
    texts: PropTypes.arrayOf(PropTypes.string).isRequired,
    typingSpeed: PropTypes.number,
    deletingSpeed: PropTypes.number,
    pauseBeforeDelete: PropTypes.number,
    className: PropTypes.string,
};

export default TypewriterArray;
