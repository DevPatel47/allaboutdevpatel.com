import React from 'react';
import { Link, NavLink, useParams } from 'react-router-dom';
import useTheme from '../../contexts/theme.js';

function Header() {
    const { themeMode, lightTheme, darkTheme } = useTheme();

    const onChangeThemeBtn = (e) => {
        const darkModeStatus = e.currentTarget.textContent === '🌙';
        if (darkModeStatus) {
            darkTheme();
        } else {
            lightTheme();
        }
    };

    const { username } = useParams();
    const basePath = username ? `/${username}` : '';

    return (
        <header
            className="w-300 h-22 p-10 m-6
            flex items-center justify-between rounded-full border-2
            text-xl
            backdrop-blur-md
            text-gray-300
            dark:border-zinc-950 dark:text-gray-300"
        >
            {/* Logo */}
            <div>
                <Link to={`${basePath}/`}>
                    Dev's <span className="text-blue-600">Portfolio.</span>
                </Link>
            </div>

            {/* Navigation */}
            <div>
                <nav className="flex items-center gap-8">
                    <NavLink
                        to={`${basePath}/`}
                        end
                        className={({ isActive }) => (isActive ? 'text-blue-600' : 'text-gray-500')}
                    >
                        Home
                    </NavLink>

                    <NavLink
                        to={`${basePath}/projects`}
                        className={({ isActive }) => (isActive ? 'text-blue-600' : 'text-gray-500')}
                    >
                        Projects
                    </NavLink>
                    <NavLink
                        to={`${basePath}/github`}
                        className={({ isActive }) => (isActive ? 'text-blue-600' : 'text-gray-500')}
                    >
                        GitHub
                    </NavLink>
                    <NavLink
                        to={`${basePath}/login`}
                        className={({ isActive }) => (isActive ? 'text-blue-600' : 'text-gray-500')}
                    >
                        Login
                    </NavLink>
                </nav>
            </div>

            {/* Theme Toggle Button */}
            <div>
                <button onClick={onChangeThemeBtn} className="text-xl">
                    {themeMode === 'dark' ? '☀️' : '🌙'}
                </button>
            </div>
        </header>
    );
}

export default Header;
