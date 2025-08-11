import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import UserService from '../services/common/user.service.js';
import { BgImage } from '../components/components.js';
import { Loading } from './pages.js';

function Login() {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState({ loading: false, error: '', ok: false });
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || '/';

    const canSubmit = identifier.trim() && password.trim() && !status.loading;

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!canSubmit) return;
        try {
            setStatus({ loading: true, error: '', ok: false });
            await UserService.login(identifier.trim(), password.trim());
            setStatus({ loading: false, error: '', ok: true });
            setTimeout(() => navigate(from, { replace: true }), 600);
        } catch (err) {
            // Keep user on page; show inline error (no Error page)
            setStatus({
                loading: false,
                error: err.message || 'Invalid credentials',
                ok: false,
            });
        }
    };

    if (status.loading) {
        return <Loading loadingMessage="Signing in..." />;
    }

    return (
        <section className="relative z-10 border-b-8 border-zinc-200 dark:border-zinc-800">
            <BgImage />
            <main
                className="
                    w-full flex items-start justify-center
                    bg-zinc-50 dark:bg-zinc-950/80
                    min-h-screen px-4 pt-32 pb-32 relative overflow-hidden
                "
                aria-label="Login Page"
            >
                <div className="relative z-0 w-full max-w-md">
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
                                text-center drop-shadow
                            "
                        >
                            Login
                        </h1>
                        <form onSubmit={onSubmit} className="flex flex-col gap-5 relative z-10">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-mono text-zinc-600 dark:text-zinc-400">
                                    Username or Email
                                </label>
                                <input
                                    autoComplete="username"
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    className="
                                        w-full px-4 py-2.5 rounded-xl
                                        bg-zinc-100 dark:bg-zinc-800
                                        border border-zinc-300 dark:border-zinc-700
                                        text-sm text-zinc-800 dark:text-zinc-100
                                        focus:outline-none focus:ring-2 focus:ring-blue-500/50
                                        transition-all
                                    "
                                    placeholder="devpatel47 or you@example.com"
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-mono text-zinc-600 dark:text-zinc-400">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="
                                        w-full px-4 py-2.5 rounded-xl
                                        bg-zinc-100 dark:bg-zinc-800
                                        border border-zinc-300 dark:border-zinc-700
                                        text-sm text-zinc-800 dark:text-zinc-100
                                        focus:outline-none focus:ring-2 focus:ring-blue-500/50
                                        transition-all
                                    "
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            {status.error && (
                                <p className="text-xs font-mono text-red-600 dark:text-red-400">
                                    {status.error}
                                </p>
                            )}
                            {status.ok && !status.error && (
                                <p className="text-xs font-mono text-green-700 dark:text-green-400">
                                    Login successful. Redirecting...
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={!canSubmit}
                                className="
                                    h-11 rounded-xl px-6 font-semibold text-sm
                                    bg-zinc-900 dark:bg-zinc-50
                                    text-zinc-50 dark:text-zinc-900
                                    disabled:opacity-50 disabled:cursor-not-allowed
                                    hover:bg-zinc-800 dark:hover:bg-zinc-200
                                    transition-all shadow
                                "
                            >
                                Sign In
                            </button>
                        </form>
                    </section>
                </div>
            </main>
        </section>
    );
}

export default Login;
