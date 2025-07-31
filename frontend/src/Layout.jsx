import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Header, Footer } from './components.js';
import { ThemeProvider } from './app/contexts/theme.js';
import Beams from './app/components/BeamsBg/BeamsBg.jsx';

function Layout() {
    const [themeMode, setThemeMode] = useState('dark');

    const lightTheme = () => setThemeMode('light');
    const darkTheme = () => setThemeMode('dark');

    useEffect(() => {
        document.documentElement.classList.remove('dark', 'light');
        document.documentElement.classList.add(themeMode);
    }, [themeMode]);

    return (
        <ThemeProvider value={{ themeMode, darkTheme, lightTheme }}>
            <div className="relative w-full h-screen overflow-hidden">
                {/* Beams background */}
                <div className="absolute inset-0 z-0">
                    <Beams
                        beamWidth={2}
                        beamHeight={30}
                        beamNumber={12}
                        lightColor="#208afa"
                        speed={1.5}
                        noiseIntensity={1.75}
                        scale={0.2}
                        rotation={135}
                    />
                </div>

                <div className="relative z-10 flex flex-col justify-between items-center h-full text-center">
                    <Header />
                    <main className="my-8 w-full max-w-3xl">
                        <Outlet />
                    </main>
                    <Footer />
                </div>
            </div>
        </ThemeProvider>
    );
}

export default Layout;
