/**
 * Layout Component
 *
 * Provides the main layout structure for the application, including theme context,
 * header, footer, and main content area. Handles theme switching and applies
 * the appropriate theme class to the document root.
 *
 * @module Layout
 */

import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { ThemeProvider } from './app/contexts/theme.js';
import { Header, Footer, AnimatedBlurDots } from './app/components/index.js';

/**
 * Layout component for the app.
 * Wraps children with ThemeProvider and renders Header, Footer, and Outlet.
 *
 * @returns {JSX.Element}
 */
function Layout() {
    const [themeMode, setThemeMode] = useState('dark');

    /**
     * Switch to light theme.
     */
    const lightTheme = () => setThemeMode('light');

    /**
     * Switch to dark theme.
     */
    const darkTheme = () => setThemeMode('dark');

    // Apply theme class to <html> element on theme change
    useEffect(() => {
        document.documentElement.classList.remove('dark', 'light');
        document.documentElement.classList.add(themeMode);
    }, [themeMode]);

    return (
        <ThemeProvider value={{ themeMode, darkTheme, lightTheme }}>
            <div
                className={`min-h-screen overflow-hidden ${
                    themeMode === 'dark' ? 'bg-zinc-950 text-zinc-50' : 'bg-zinc-50 text-zinc-950'
                }`}
            >
                <Header />
                <main className="relative min-h-screen">
                    <Outlet />
                </main>
                <Footer />
            </div>
        </ThemeProvider>
    );
}

export default Layout;
