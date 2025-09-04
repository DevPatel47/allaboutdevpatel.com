/**
 * Header Component
 *
 * Provides the main navigation bar, logo, theme switcher, and responsive menu.
 * Supports both light and dark themes and adapts to user profile routes.
 *
 * @module Header
 */

import React, { useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import useTheme from '../contexts/theme.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { Logo } from './components.js';

/**
 * Header component for the application.
 * Renders navigation, logo, and theme switcher.
 * @returns {JSX.Element}
 */
function Header() {
    const { themeMode, lightTheme, darkTheme } = useTheme();
    const [menuOpen, setMenuOpen] = useState(false);

    /**
     * Handles theme toggle button click.
     */
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
        <header
            className="
                container mx-auto h-20 pr-8 mt-4 z-50
                fixed inset-x-0 top-0 
                bg-zinc-50/20 dark:bg-zinc-900/20 backdrop-blur-lg
                flex items-center justify-between
                text-zinc-900 dark:text-zinc-50
                border-2 border-zinc-200 dark:border-zinc-900 rounded-full
                transition-all duration-300
            "
            role="banner"
        >
            <Logo className="transition-all duration-300" />

            {/* Mobile menu button */}
            <div className="w-full flex justify-end transition-all duration-300">
                <button
                    className="md:hidden p-2 rounded-md hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 transition-all duration-300"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={menuOpen}
                    aria-controls="mobile-menu"
                    type="button"
                >
                    <FontAwesomeIcon
                        icon={faBars}
                        className="h-5 w-5 transition-all duration-300"
                    />
                </button>
            </div>

            {/* Desktop navigation */}
            <div className="flex items-center transition-all duration-300">
                <nav
                    className="hidden md:flex flex-row items-center gap-8 transition-all duration-300"
                    aria-label="Main navigation"
                >
                    <NavLink
                        to={`${basePath}/`}
                        end
                        className={({ isActive }) =>
                            (isActive ? '' : 'text-zinc-500 dark:text-zinc-400') +
                            ' text-sm md:text-base font-semibold hover:text-zinc-600 dark:hover:text-zinc-300 transition-all duration-300'
                        }
                    >
                        Home
                    </NavLink>
                    <NavLink
                        to={`${basePath}/projects`}
                        end
                        className={({ isActive }) =>
                            (isActive ? '' : 'text-zinc-500 dark:text-zinc-400') +
                            ' text-sm md:text-base font-semibold hover:text-zinc-600 dark:hover:text-zinc-300 transition-all duration-300'
                        }
                    >
                        Projects
                    </NavLink>
                    <NavLink
                        to={`${basePath}/github`}
                        end
                        className={({ isActive }) =>
                            (isActive ? '' : 'text-zinc-500 dark:text-zinc-400') +
                            ' text-sm md:text-base font-semibold hover:text-zinc-600 dark:hover:text-zinc-300 transition-all duration-300'
                        }
                    >
                        Github
                    </NavLink>
                    <NavLink
                        to={`/admin`}
                        end
                        className={({ isActive }) =>
                            (isActive ? '' : 'text-zinc-500 dark:text-zinc-400') +
                            ' text-sm md:text-base font-semibold hover:text-zinc-600 dark:hover:text-zinc-300 transition-all duration-300'
                        }
                    >
                        Admin
                    </NavLink>
                    <button
                        onClick={onChangeThemeBtn}
                        className="w-24 flex flex-row justify-around items-center text-sm font-semibold text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-all duration-300"
                        aria-label="Toggle theme"
                        type="button"
                    >
                        Theme
                        {themeMode === 'dark' ? (
                            <FontAwesomeIcon
                                icon={faSun}
                                className="h-5 w-5 transition-all duration-300"
                            />
                        ) : (
                            <FontAwesomeIcon
                                icon={faMoon}
                                className="h-5 w-5 transition-all duration-300"
                            />
                        )}
                    </button>
                </nav>

                {/* Mobile navigation menu */}
                {menuOpen && (
                    <div
                        id="mobile-menu"
                        className="absolute top-20 right-4 bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-4
                        flex flex-col space-y-2 md:hidden
                        animate-fade-in
                        transition-all duration-300"
                        role="menu"
                        aria-label="Mobile navigation"
                    >
                        <NavLink
                            to={`${basePath}/`}
                            end
                            className={({ isActive }) =>
                                (isActive ? '' : 'text-zinc-500 dark:text-zinc-400') +
                                ' text-sm md:text-base font-semibold hover:text-zinc-600 dark:hover:text-zinc-300 transition-all duration-300'
                            }
                            role="menuitem"
                            onClick={() => setMenuOpen(false)}
                        >
                            Home
                        </NavLink>
                        <NavLink
                            to={`${basePath}/projects`}
                            end
                            className={({ isActive }) =>
                                (isActive ? '' : 'text-zinc-500 dark:text-zinc-400') +
                                ' text-sm md:text-base font-semibold hover:text-zinc-600 dark:hover:text-zinc-300 transition-all duration-300'
                            }
                            role="menuitem"
                            onClick={() => setMenuOpen(false)}
                        >
                            Projects
                        </NavLink>
                        <NavLink
                            to={`${basePath}/github`}
                            end
                            className={({ isActive }) =>
                                (isActive ? '' : 'text-zinc-500 dark:text-zinc-400') +
                                ' text-sm md:text-base font-semibold hover:text-zinc-600 dark:hover:text-zinc-300 transition-all duration-300'
                            }
                            role="menuitem"
                            onClick={() => setMenuOpen(false)}
                        >
                            Github
                        </NavLink>
                        <NavLink
                            to={`${basePath}/admin`}
                            end
                            className={({ isActive }) =>
                                (isActive ? '' : 'text-zinc-500 dark:text-zinc-400') +
                                ' text-sm md:text-base font-semibold hover:text-zinc-600 dark:hover:text-zinc-300 transition-all duration-300'
                            }
                            role="menuitem"
                            onClick={() => setMenuOpen(false)}
                        >
                            Admin
                        </NavLink>
                        <button
                            onClick={() => {
                                onChangeThemeBtn();
                                setMenuOpen(false);
                            }}
                            className="text-sm font-semibold hover:text-zinc-600 dark:hover:text-zinc-300 transition-all duration-300"
                            aria-label="Toggle theme"
                            type="button"
                        >
                            <span className="text-sm">Theme</span>{' '}
                            {themeMode === 'dark' ? (
                                <FontAwesomeIcon
                                    icon={faSun}
                                    className="h-5 w-5 transition-all duration-300"
                                />
                            ) : (
                                <FontAwesomeIcon
                                    icon={faMoon}
                                    className="h-5 w-5 transition-all duration-300"
                                />
                            )}
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}

export default Header;
