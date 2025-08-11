import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import UserService from '../services/common/user.service.js';
import { BgImage } from '../components/components.js';
import { Loading } from './pages.js';

function Admin() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        let active = true;
        (async () => {
            try {
                const u = await UserService.getCurrentUser();
                if (active) setUser(u);
            } catch {
                navigate('/login', { replace: true, state: { from: location.pathname } });
            } finally {
                if (active) setLoading(false);
            }
        })();
        return () => {
            active = false;
        };
    }, [navigate, location.pathname]);

    if (loading) {
        return <Loading loadingMessage="Checking access..." />;
    }

    if (!user) return null;

    return (
        <section className="relative z-10 border-b-8 border-zinc-200 dark:border-zinc-800">
            <BgImage />
            <main
                className="
                    w-full flex items-start justify-center
                    bg-zinc-50 dark:bg-zinc-950/80
                    min-h-screen px-4 pt-32 pb-32 relative overflow-hidden
                "
                aria-label="Admin Page"
            >
                <div className="relative z-0 w-full max-w-4xl">
                    <section
                        className="
                            relative rounded-3xl overflow-hidden
                            border border-zinc-200 dark:border-zinc-800
                            bg-gradient-to-br from-zinc-100 via-zinc-50 to-zinc-200
                            dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900
                            shadow-xl p-8 md:p-10 flex flex-col gap-6
                        "
                    >
                        <div className="absolute inset-0 pointer-events-none [mask-image:radial-gradient(circle_at_center,black,transparent_78%)]" />
                        <h1
                            className="
                                text-3xl md:text-4xl font-extrabold font-poiret
                                tracking-tight text-zinc-900 dark:text-zinc-50
                                drop-shadow
                            "
                        >
                            Admin Dashboard
                        </h1>
                        <p className="text-sm font-mono text-zinc-600 dark:text-zinc-400">
                            Welcome, {user.username}.
                        </p>
                        {/* Add admin management components here */}
                    </section>
                </div>
            </main>
        </section>
    );
}

export default Admin;
