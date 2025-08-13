import React from 'react';
import PropTypes from 'prop-types';
import boyWithLaptop from '../../assets/boy-with-laptop.png';
import { AnimatedBlurDots, RichText } from './components.js';

/**
 * AboutMe Component
 *
 * Renders a visually appealing and responsive "About Me" section with a developer theme.
 * Includes a gradient background, decorative elements, and a summary of achievements.
 *
 * @component
 * @param {Object} props
 * @param {string} props.description - The main about description text.
 * @returns {JSX.Element}
 *
 * @example
 * <AboutMe description="I'm a passionate developer building things for the web." />
 */
function AboutMe({ description }) {
    return (
        <section
            className="
                w-full flex items-center justify-center
                bg-zinc-50 dark:bg-zinc-950
                px-4 pt-16 relative
                transition-all duration-300
            "
            aria-label="About Me Section"
        >
            <AnimatedBlurDots count={20} />
            <div
                className="
                    relative z-0 p-6
                    flex flex-col-reverse lg:flex-row
                    items-center md:items-center
                    justify-between
                    w-full max-w-5xl
                    gap-10 md:gap-20
                    transition-all duration-300
                "
            >
                {/* Text Content */}
                <div
                    className="
                        flex-1 flex flex-col justify-center
                        items-center md:items-start
                        h-full
                        transition-all duration-300
                    "
                >
                    <h3 className="hidden lg:block heading-section mb-6 text-zinc-900 dark:text-zinc-50 text-center lg:text-left drop-shadow transition-all duration-300">
                        👨‍💻 About Me
                    </h3>
                    <div className="text-body w-full max-w-2xl bg-zinc-50/95 dark:bg-zinc-900/90 rounded-xl p-6 shadow-md backdrop-blur-sm transition-all duration-300">
                        <RichText text={description} as="div" />
                    </div>
                    <div
                        className="
                            lg:hidden w-full mt-6 flex flex-col items-start gap-2
                            transition-all duration-300
                        "
                    >
                        <span
                            className="
                                text-xs font-mono text-zinc-700 dark:text-zinc-200
                                bg-zinc-200/80 dark:bg-zinc-800 px-2 py-1 rounded
                                transition-all duration-300
                            "
                        >
                            {'// passionate about building things for the web'}
                        </span>
                        <span
                            className="
                                text-xs font-mono text-green-700 dark:text-green-300
                                bg-zinc-200/80 dark:bg-zinc-800 px-2 py-1 rounded
                                transition-all duration-300 flex items-center gap-1
                            "
                        >
                            <span className="text-zinc-600 dark:text-zinc-400">$</span>
                            <span className="animate-pulse">npm run build-my-dreams</span>
                            <span className="text-zinc-400 dark:text-zinc-500">...</span>
                        </span>
                        <span
                            className="
                                text-xs font-mono text-green-800 dark:text-green-200
                                bg-zinc-200/80 dark:bg-zinc-800 px-2 py-1 rounded
                                transition-all duration-300 flex items-center gap-1
                            "
                        >
                            <span>&#10003;</span>
                            <span>Scored well in 12th</span>
                        </span>
                        <span
                            className="
                                text-xs font-mono text-blue-800 dark:text-blue-200
                                bg-zinc-200/80 dark:bg-zinc-800 px-2 py-1 rounded
                                transition-all duration-300 flex items-center gap-1
                            "
                        >
                            <span>&#10148;</span>
                            <span>Came to Canada</span>
                        </span>
                        <span
                            className="
                                text-xs font-mono text-indigo-800 dark:text-indigo-200
                                bg-zinc-200/80 dark:bg-zinc-800 px-2 py-1 rounded
                                transition-all duration-300 flex items-center gap-1
                            "
                        >
                            <span>&#128187;</span>
                            <span>Learning & building every day!</span>
                        </span>
                    </div>
                </div>
                {/* Image */}
                <div
                    className="
                        flex-shrink-0 flex flex-col items-center justify-center
                        h-full gap-6
                        transition-all duration-300
                        relative z-0
                    "
                >
                    <h3 className="lg:hidden heading-section mb-6 text-zinc-900 dark:text-zinc-50 text-center drop-shadow transition-all duration-300">
                        👨‍💻 About Me
                    </h3>
                    <div className="relative group transition-all duration-300">
                        <img
                            src={boyWithLaptop}
                            alt="Boy with Laptop"
                            className="
                                w-full h-auto sm:w-72 sm:h-72
                                object-contain drop-shadow-2xl rounded-3xl
                                bg-zinc-50 dark:bg-zinc-900 p-3
                                border-4 border-zinc-300 dark:border-zinc-700
                                transition-all duration-300 group-hover:scale-105
                                z-0
                            "
                            loading="lazy"
                            draggable="false"
                        />
                        <div
                            className="
                                absolute -bottom-2 left-1/2 -translate-x-1/2
                                bg-zinc-900 dark:bg-zinc-700 text-zinc-50 text-xs
                                px-4 py-1 rounded-full shadow-lg font-mono opacity-95
                                whitespace-nowrap transition-all duration-300
                                z-10
                            "
                            aria-label="FullStack Developer"
                        >
                            {`<FullStack />`}
                        </div>
                    </div>
                    <div
                        className="
                            hidden lg:flex w-full mt-6 flex-col items-start gap-2
                            transition-all duration-300
                        "
                    >
                        <span
                            className="
                                text-xs font-mono text-zinc-700 dark:text-zinc-200
                                bg-zinc-200/80 dark:bg-zinc-800 px-2 py-1 rounded
                                transition-all duration-300
                            "
                        >
                            {'// passionate about building things for the web'}
                        </span>
                        <span
                            className="
                                text-xs font-mono text-green-700 dark:text-green-300
                                bg-zinc-200/80 dark:bg-zinc-800 px-2 py-1 rounded
                                transition-all duration-300 flex items-center gap-1
                            "
                        >
                            <span className="text-zinc-600 dark:text-zinc-400">$</span>
                            <span className="animate-pulse">npm run build-my-dreams</span>
                            <span className="text-zinc-400 dark:text-zinc-500">...</span>
                        </span>
                        <span
                            className="
                                text-xs font-mono text-green-800 dark:text-green-200
                                bg-zinc-200/80 dark:bg-zinc-800 px-2 py-1 rounded
                                transition-all duration-300 flex items-center gap-1
                            "
                        >
                            <span>&#10003;</span>
                            <span>Scored well in 12th</span>
                        </span>
                        <span
                            className="
                                text-xs font-mono text-blue-800 dark:text-blue-200
                                bg-zinc-200/80 dark:bg-zinc-800 px-2 py-1 rounded
                                transition-all duration-300 flex items-center gap-1
                            "
                        >
                            <span>&#10148;</span>
                            <span>Came to Canada</span>
                        </span>
                        <span
                            className="
                                text-xs font-mono text-indigo-800 dark:text-indigo-200
                                bg-zinc-200/80 dark:bg-zinc-800 px-2 py-1 rounded
                                transition-all duration-300 flex items-center gap-1
                            "
                        >
                            <span>&#128187;</span>
                            <span>Learning & building every day!</span>
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}

AboutMe.propTypes = {
    description: PropTypes.string.isRequired,
};

export default AboutMe;
