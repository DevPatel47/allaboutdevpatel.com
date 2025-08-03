import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { ThemeProvider } from './app/contexts/theme.js';
import { Header, Footer, BeamsBg } from './app/components/index.js';

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
            <div className="relative min-h-screen w-full overflow-x-hidden">
                {/* BeamsBg background */}
                <div className="absolute inset-0 z-0">
                    <BeamsBg
                        beamWidth={1}
                        beamHeight={30}
                        beamNumber={30}
                        lightColor="#208afa"
                        speed={3}
                        noiseIntensity={0.3}
                        scale={0.2}
                        rotation={135}
                    />
                </div>

                <div className="relative z-10 flex flex-col min-h-screen items-center justify-between">
                    <Header />
                    <main
                        className="flex flex-col items-center justify-start
                    my-8 px-4 
                    w-full max-w-6xl mx-auto min-h-[calc(100vh-400px)]"
                    >
                        <Outlet />
                    </main>
                    <Footer />
                </div>
            </div>
        </ThemeProvider>
    );
}

export default Layout;
