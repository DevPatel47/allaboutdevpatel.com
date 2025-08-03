import React, { useState } from 'react';
import { Link, NavLink, useParams } from 'react-router-dom';
import useTheme from '../contexts/theme.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

function Header() {
    const { themeMode, lightTheme, darkTheme } = useTheme();
    const [menuOpen, setMenuOpen] = useState(false);

    const onChangeThemeBtn = () => {
        if (themeMode === 'dark') {
            lightTheme();
        } else {
            darkTheme();
        }
    };

    const { username } = useParams();
    const basePath = username ? `/${username}` : '';

    return (
        <>
            <header
                className="container w-full md:w-300 h-auto p-6 md:p-6 m-2 md:m-6
                flex flex-row items-center justify-between rounded-full 
                bg-white/30 dark:bg-zinc-950/30 backdrop-blur-md
                border-2 border-zinc-50 dark:border-zinc-950
                text-xl text-white dark:text-gray-300 relative z-50"
            >
                {/* Logo */}
                <div className="mb-0 mx-6">
                    <Link to={`${basePath}/`} className="font-bold dark:text-gray-300 text-2xl">
                        Dev's <span className="text-blue-600">Portfolio.</span>
                    </Link>
                </div>

                {/* Hamburger Button for Mobile */}
                <div className="md:hidden flex items-center">
                    <button
                        className="flex items-center px-3 py-2 border rounded dark:text-gray-500 dark:border-gray-500"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle navigation"
                    >
                        <FontAwesomeIcon icon={faBars} className="h-6 w-6" />
                    </button>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex flex-row items-center gap-8">
                    <NavLink
                        to={`${basePath}/`}
                        end
                        className={({ isActive }) =>
                            (isActive ? 'text-blue-600' : 'dark:text-gray-500') +
                            ' hover:text-blue-500 transition-colors'
                        }
                    >
                        Home
                    </NavLink>
                    <NavLink
                        to={`${basePath}/projects`}
                        className={({ isActive }) =>
                            (isActive ? 'text-blue-600' : 'dark:text-gray-500') +
                            ' hover:text-blue-500 transition-colors'
                        }
                    >
                        Projects
                    </NavLink>
                    <NavLink
                        to={`${basePath}/github`}
                        className={({ isActive }) =>
                            (isActive ? 'text-blue-600' : 'dark:text-gray-500') +
                            ' hover:text-blue-500 transition-colors'
                        }
                    >
                        GitHub
                    </NavLink>
                    <NavLink
                        to={`${basePath}/login`}
                        className={({ isActive }) =>
                            (isActive ? 'text-blue-600' : 'dark:text-gray-500') +
                            ' hover:text-blue-500 transition-colors'
                        }
                    >
                        Login
                    </NavLink>
                    {/* Theme Toggle Button */}
                    <button
                        onClick={onChangeThemeBtn}
                        className="text-xl ml-2 dark:text-gray-500"
                        aria-label="Toggle theme"
                    >
                        {themeMode === 'dark' ? (
                            <FontAwesomeIcon icon={faSun} className="h-5 w-5" />
                        ) : (
                            <FontAwesomeIcon icon={faMoon} className="h-5 w-5" />
                        )}
                    </button>
                </nav>
            </header>

            {/* Mobile Navigation - OUTSIDE header */}
            {menuOpen && (
                <div
                    className="
                        fixed top-[90px] left-0 w-full
                        flex flex-col items-center gap-4
                        backdrop-blur-md
                        rounded-b-3xl
                        p-6 shadow-lg z-40
                        md:hidden
                        animate-fade-in
                    "
                >
                    <NavLink
                        to={`${basePath}/`}
                        end
                        className={({ isActive }) =>
                            (isActive ? 'text-blue-600' : 'dark:text-gray-500') +
                            ' hover:text-blue-500 transition-colors'
                        }
                        onClick={() => setMenuOpen(false)}
                    >
                        Home
                    </NavLink>
                    <NavLink
                        to={`${basePath}/projects`}
                        className={({ isActive }) =>
                            (isActive ? 'text-blue-600' : 'dark:text-gray-500') +
                            ' hover:text-blue-500 transition-colors'
                        }
                        onClick={() => setMenuOpen(false)}
                    >
                        Projects
                    </NavLink>
                    <NavLink
                        to={`${basePath}/github`}
                        className={({ isActive }) =>
                            (isActive ? 'text-blue-600' : 'dark:text-gray-500') +
                            ' hover:text-blue-500 transition-colors'
                        }
                        onClick={() => setMenuOpen(false)}
                    >
                        GitHub
                    </NavLink>
                    <NavLink
                        to={`${basePath}/login`}
                        className={({ isActive }) =>
                            (isActive ? 'text-blue-600' : 'dark:text-gray-500') +
                            ' hover:text-blue-500 transition-colors'
                        }
                        onClick={() => setMenuOpen(false)}
                    >
                        Login
                    </NavLink>
                    {/* Theme Toggle Button */}
                    <button
                        onClick={onChangeThemeBtn}
                        className="text-xl mt-2 dark:text-gray-500"
                        aria-label="Toggle theme"
                    >
                        {themeMode === 'dark' ? (
                            <FontAwesomeIcon icon={faSun} className="h-5 w-5" />
                        ) : (
                            <FontAwesomeIcon icon={faMoon} className="h-5 w-5" />
                        )}
                    </button>
                </div>
            )}
        </>
    );
}

export default Header;
