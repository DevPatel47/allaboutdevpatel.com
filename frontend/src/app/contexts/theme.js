/**
 * Theme context for managing light/dark mode across the application.
 * Provides theme state and functions to switch themes.
 * @module ThemeContext
 */

import { createContext, useContext } from 'react';

/**
 * Default theme context value.
 * @type {{ themeMode: string, darkTheme: Function, lightTheme: Function }}
 */
export const ThemeContext = createContext({
    themeMode: 'dark',
    darkTheme: () => {},
    lightTheme: () => {},
});

/**
 * ThemeProvider for wrapping the app and providing theme context.
 * @type {React.Provider}
 */
export const ThemeProvider = ThemeContext.Provider;

/**
 * Custom hook to access the theme context.
 * @returns {{ themeMode: string, darkTheme: Function, lightTheme: Function }}
 * @example
 * const { themeMode, darkTheme, lightTheme } = useTheme();
 */
export default function useTheme() {
    return useContext(ThemeContext);
}
