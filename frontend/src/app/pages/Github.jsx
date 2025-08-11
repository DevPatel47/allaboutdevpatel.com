import React, { useEffect, useState } from 'react';
import GitHubService from '../services/integrations/github.service.js';
import { BgImage } from '../components/components.js';
import { Loading, Error } from './pages.js';

const SHOWCASE_USERNAME = 'devpatel47';

function GitHub() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState('');

    useEffect(() => {
        let active = true;
        (async () => {
            try {
                setErr('');
                setLoading(true);
                const data = await GitHubService.getUser(SHOWCASE_USERNAME);
                if (active) setProfile(data);
            } catch {
                if (active) {
                    setErr('Failed to load GitHub profile.');
                    setProfile(null);
                }
            } finally {
                if (active) setLoading(false);
            }
        })();
        return () => {
            active = false;
        };
    }, []);

    const StatBadge = ({ label, value }) => (
        <div
            className="
                flex flex-col items-center justify-center
                px-5 py-4 rounded-2xl
                bg-gradient-to-br from-zinc-100 to-zinc-200
                dark:from-zinc-800 dark:to-zinc-900
                border border-zinc-200 dark:border-zinc-700
                shadow-sm
            "
        >
            <span className="text-2xl font-bold text-blue-700 dark:text-blue-300 tracking-tight">
                {value}
            </span>
            <span className="mt-1 text-[11px] font-mono uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
                {label}
            </span>
        </div>
    );

    if (loading) {
        return <Loading loadingMessage="Loading GitHub profile..." />;
    }

    if (err) {
        return <Error errorMessage={err} />;
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
                aria-label="GitHub Profile Showcase"
            >
                <div className="relative z-0 w-full max-w-5xl flex flex-col gap-14">
                    <section
                        className="
                            relative rounded-3xl
                            overflow-hidden
                            border border-zinc-200 dark:border-zinc-800
                            bg-gradient-to-br from-zinc-100 via-zinc-50 to-zinc-200
                            dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900
                            shadow-xl
                            p-8 md:p-12
                            flex flex-col items-center md:items-start gap-8
                        "
                    >
                        <div className="absolute inset-0 pointer-events-none [mask-image:radial-gradient(circle_at_center,black,transparent_80%)]" />
                        <h1
                            className="
                                text-4xl md:text-6xl font-extrabold font-poiret
                                tracking-tight text-zinc-900 dark:text-zinc-50
                                text-center md:text-left drop-shadow
                            "
                        >
                            GitHub Presence
                        </h1>

                        <div className="flex flex-col md:flex-row items-center gap-10 w-full">
                            <div className="flex flex-col items-center md:items-start gap-5">
                                <img
                                    src={profile.avatar_url}
                                    alt={`${profile.login} avatar`}
                                    className="
                                        w-40 h-40 rounded-3xl object-cover
                                        border border-zinc-300 dark:border-zinc-700
                                        shadow-lg
                                    "
                                    loading="lazy"
                                    draggable="false"
                                />
                                <div className="flex flex-col items-center md:items-start">
                                    <h2 className="text-2xl md:text-3xl font-bold text-blue-900 dark:text-blue-200 tracking-tight">
                                        {profile?.name || profile?.login}
                                    </h2>
                                    <p className="text-xs font-mono text-zinc-600 dark:text-zinc-400">
                                        @{profile?.login}
                                    </p>
                                </div>
                                {profile?.bio && (
                                    <p
                                        className="
                                            text-sm md:text-base leading-relaxed
                                            text-zinc-700 dark:text-zinc-300
                                            max-w-xs md:max-w-sm text-center md:text-left
                                        "
                                    >
                                        {profile.bio}
                                    </p>
                                )}
                                <div className="flex gap-3 flex-wrap pt-1">
                                    <a
                                        href={profile.html_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="
                                            text-xs md:text-sm font-semibold px-4 py-2 rounded-full
                                            bg-zinc-900 dark:bg-zinc-50
                                            text-zinc-50 dark:text-zinc-900
                                            hover:bg-zinc-800 dark:hover:bg-zinc-200
                                            transition-colors shadow
                                        "
                                    >
                                        GitHub Profile
                                    </a>
                                    {profile.blog && (
                                        <a
                                            href={
                                                profile.blog.startsWith('http')
                                                    ? profile.blog
                                                    : 'https://' + profile.blog
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="
                                                text-xs md:text-sm font-semibold px-4 py-2 rounded-full
                                                bg-blue-700/90 dark:bg-blue-500/20
                                                text-zinc-50 dark:text-blue-200
                                                hover:bg-blue-700 dark:hover:bg-blue-500/30
                                                transition-colors shadow
                                            "
                                        >
                                            Website
                                        </a>
                                    )}
                                </div>
                            </div>

                            <div className="flex-1 w-full">
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6 w-full">
                                    <StatBadge label="Repositories" value={profile.public_repos} />
                                    <StatBadge label="Followers" value={profile.followers} />
                                    <StatBadge label="Following" value={profile.following} />
                                </div>
                                <div className="mt-8 flex flex-col gap-2 text-[11px] font-mono text-zinc-600 dark:text-zinc-500">
                                    <span>
                                        Joined: {new Date(profile.created_at).toLocaleDateString()}
                                    </span>
                                    <span>
                                        Updated: {new Date(profile.updated_at).toLocaleDateString()}
                                    </span>
                                    {profile.location && <span>Location: {profile.location}</span>}
                                    {profile.company && <span>Company: {profile.company}</span>}
                                </div>
                            </div>
                        </div>
                    </section>

                    <section
                        className="
                            mx-auto w-full
                            p-8 md:p-10 rounded-3xl
                            bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600
                            dark:from-blue-700 dark:via-indigo-700 dark:to-violet-700
                            text-zinc-50 shadow-lg border border-blue-400/30 dark:border-blue-300/20
                            flex flex-col md:flex-row gap-6 items-center justify-between
                        "
                    >
                        <div className="flex-1">
                            <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
                                Exploring the Code
                            </h3>
                            <p className="text-sm md:text-base text-blue-50/90 leading-relaxed max-w-lg">
                                Public repositories highlight growth and learning. Follow the
                                journey, star interesting projects, and collaborate.
                            </p>
                        </div>
                        <a
                            href={`${profile.html_url}?tab=repositories`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="
                                px-6 py-3 rounded-xl font-semibold text-sm md:text-base
                                bg-zinc-900/90 dark:bg-zinc-50/90
                                text-zinc-50 dark:text-zinc-900
                                hover:bg-zinc-800 dark:hover:bg-zinc-200
                                shadow-md transition-colors
                            "
                        >
                            View Repositories →
                        </a>
                    </section>
                </div>
            </main>
        </section>
    );
}

export default GitHub;
