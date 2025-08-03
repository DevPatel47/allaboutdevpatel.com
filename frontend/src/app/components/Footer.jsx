import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin, faInstagram } from '@fortawesome/free-brands-svg-icons';

function Footer() {
    return (
        <div
            className="w-full h-40 
        flex flex-col items-center justify-around backdrop-blur-md 
        text-xl text-white dark:text-gray-500 text-center
        border-t-2 border-zinc-50 dark:border-zinc-950
        "
        >
            <div className="flex flex-col items-evenly gap-2">
                <p>Follow me on:</p>
                <div className="flex gap-4 text-4xl">
                    <a
                        href="https://github.com/DevPatel47"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-500 transition-colors"
                    >
                        <FontAwesomeIcon icon={faGithub} />
                    </a>
                    <a
                        href="https://www.linkedin.com/in/devpatel47/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-500 transition-colors"
                    >
                        <FontAwesomeIcon icon={faLinkedin} />
                    </a>
                    <a
                        href="https://www.instagram.com/_.dev47/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-500 transition-colors"
                    >
                        <FontAwesomeIcon icon={faInstagram} />
                    </a>
                </div>
            </div>
            <p>© {new Date().getFullYear()} Dev's Portfolio. All rights reserved.</p>
        </div>
    );
}

export default Footer;
