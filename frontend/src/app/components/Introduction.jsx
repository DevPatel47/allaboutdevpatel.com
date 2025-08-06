import React from 'react';
import PropTypes from 'prop-types';
import { TypewriterArray, ShineTextBg, SocialLinks, BgImage } from './index.js';

/**
 * Introduction Component
 *
 * Renders the main introduction section with a background, animated name, typewriter effect,
 * tagline, profile image, action buttons, and social links.
 *
 * @component
 * @param {Object} props
 * @param {Object} props.introduction - Introduction data (name, greeting, tagline, profileImage, resume).
 * @param {string} props.introduction.name - The user's name.
 * @param {string} props.introduction.greeting - The greeting text.
 * @param {string} props.introduction.tagline - The tagline text.
 * @param {string} props.introduction.profileImage - The profile image URL.
 * @param {string} props.introduction.resume - The resume URL.
 * @param {Array} props.socialLinks - Array of social link objects.
 * @returns {JSX.Element}
 *
 * @example
 * <Introduction
 *   introduction={{
 *     name: "Dev Patel",
 *     greeting: "Hello!",
 *     tagline: "Full Stack Developer",
 *     profileImage: "http://res.cloudinary.com/dcagw3o23/image/upload/v1754111985/ndxlf6r3dfnfzg9vzzy7.png",
 *     resume: "http://res.cloudinary.com/dcagw3o23/image/upload/v1753239385/zivdyavyqffdbt8ppdry.pdf"
 *   }}
 *   socialLinks={[{ icon: "github", url: "https://github.com" }]}
 * />
 */
function Introduction({ introduction, socialLinks }) {
    return (
        <section className="relative z-10 border-b-8 border-zinc-200 dark:border-zinc-800">
            <BgImage />
            <ShineTextBg text={introduction?.name} />
            <div
                className="
                    pt-[150px] py-6
                    text-zinc-700 dark:text-zinc-200
                    relative z-10
                    bg-zinc-50 dark:bg-zinc-950
                    bg-opacity-50 dark:bg-opacity-75
                    min-h-screen
                    transition-all duration-300
                    flex flex-col items-center
                "
            >
                {/* Typewriter */}
                <div className="w-full flex justify-center transition-all duration-300">
                    <TypewriterArray
                        texts={[
                            `${introduction?.greeting}`,
                            `I am ${introduction?.name}.`,
                            'Welcome to my portfolio.',
                        ]}
                        className="
                            w-full
                            text-3xl sm:text-4xl md:text-6xl lg:text-7xl
                            flex justify-center items-center
                            font-extrabold font-poiret
                            drop-shadow-2xl
                            text-center
                            min-h-[4.5rem] md:min-h-[6rem] lg:min-h-[7.5rem]
                            transition-all duration-300
                            px-2
                            break-words
                        "
                    />
                </div>

                {/* Tagline */}
                <div className="w-full flex justify-center transition-all duration-300">
                    <h2
                        className="
                            p-2
                            text-lg md:text-2xl lg:text-3xl
                            font-bold font-poiret
                            text-center
                            drop-shadow-2xl
                            text-zinc-500 dark:text-zinc-400
                            transition-all duration-300
                            max-w-2xl
                        "
                    >
                        {introduction?.tagline}
                    </h2>
                </div>

                {/* Profile Image */}
                <div className="flex justify-center transition-all duration-300">
                    <img
                        src={introduction?.profileImage}
                        alt={`${introduction?.name}'s image`}
                        className="
                            rounded-2xl
                            w-72 h-96
                            object-cover
                            transition-all duration-300
                        "
                        loading="lazy"
                        draggable="false"
                    />
                </div>

                {/* Action Buttons */}
                <div
                    className="
                        flex justify-center mt-8 p-4 gap-8 flex-wrap
                        transition-all duration-300
                    "
                >
                    <a
                        href={introduction?.resume}
                        className="
                            relative h-12 px-5 py-2.5
                            overflow-hidden rounded
                            text-lg font-semibold
                            bg-zinc-950 dark:bg-zinc-50
                            text-zinc-50 dark:text-zinc-950
                            transition-all duration-300
                            hover:bg-zinc-800 dark:hover:bg-zinc-200
                            hover:ring-2 hover:ring-zinc-800 dark:hover:ring-zinc-200
                            hover:ring-offset-2 dark:hover:ring-offset-zinc-950
                        "
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <span className="transition-all duration-300">View Resume</span>
                    </a>
                    <a
                        href="mailto:dev080405.patel@gmail.com"
                        className="
                            relative h-12 px-5 py-2.5
                            overflow-hidden rounded
                            text-lg font-semibold
                            bg-zinc-950 dark:bg-zinc-50
                            text-zinc-50 dark:text-zinc-950
                            transition-all duration-300
                            hover:bg-zinc-800 dark:hover:bg-zinc-200
                            hover:ring-2 hover:ring-zinc-800 dark:hover:ring-zinc-200
                            hover:ring-offset-2 dark:hover:ring-offset-zinc-950
                        "
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <span className="transition-all duration-300">Hire Me</span>
                    </a>
                </div>

                {/* Social Links */}
                <SocialLinks socialLinks={socialLinks} />
            </div>
        </section>
    );
}

Introduction.propTypes = {
    introduction: PropTypes.shape({
        name: PropTypes.string,
        greeting: PropTypes.string,
        tagline: PropTypes.string,
        profileImage: PropTypes.string,
        resume: PropTypes.string,
    }).isRequired,
    socialLinks: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Introduction;
