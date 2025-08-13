import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import PortfolioService from '../services/portfolio/portfolio.service.js';
import ProjectService from '../services/portfolio/project.service.js';

import { BgImage, RichText } from '../components/components.js';
import { Loading, Error } from './pages.js';

function Projects() {
    const { username } = useParams();
    const DEFAULT_USERNAME = 'devpatel47';

    // State (renamed for clarity)
    const [projectList, setProjectList] = useState([]);
    const [portfolioUserId, setPortfolioUserId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTag, setSelectedTag] = useState('');

    // Fetch portfolio + projects
    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setErrorMessage('');
                setIsLoading(true);

                // Resolve portfolio (by provided username or fallback)
                const portfolioResponse = await PortfolioService.getByUsername(
                    username || DEFAULT_USERNAME,
                );
                const portfolio = portfolioResponse?.portfolio || portfolioResponse;
                const uid = portfolio?.user?._id;
                if (!uid) throw new Error('User not found');
                if (mounted) setPortfolioUserId(uid);

                // Fetch all projects for that user
                const projects = await ProjectService.getByUserId(uid);
                if (mounted) setProjectList(projects || []);
            } catch (e) {
                if (mounted) setErrorMessage(e.message || 'Failed to load projects');
            } finally {
                if (mounted) setIsLoading(false);
            }
        })();
        return () => {
            mounted = false;
        };
    }, [username]);

    // Helpers
    const normalize = (s) => (s || '').toLowerCase();

    const filteredProjects = projectList.filter((project) => {
        const matchesSearch =
            !searchQuery ||
            normalize(project.title).includes(normalize(searchQuery)) ||
            normalize(project.description).includes(normalize(searchQuery)) ||
            project.techStack?.some((t) => normalize(t).includes(normalize(searchQuery))) ||
            project.tags?.some((t) => normalize(t).includes(normalize(searchQuery)));
        const matchesTag =
            !selectedTag || project.tags?.map(normalize).includes(normalize(selectedTag));
        return matchesSearch && matchesTag;
    });

    if (isLoading) return <Loading loadingMessage="Loading projects..." />;
    if (errorMessage) return <Error errorMessage={errorMessage} />;

    const allTags = Array.from(
        new Set(projectList.flatMap((p) => (Array.isArray(p.tags) ? p.tags : []))),
    );

    return (
        <section className="relative z-10 border-b-8 border-zinc-200 dark:border-zinc-800">
            <BgImage />
            <main
                className="
                    w-full flex items-start justify-center
                    bg-zinc-50 dark:bg-zinc-950
                    bg-opacity-60 dark:bg-opacity-80
                    min-h-screen px-4 pt-[150px] pb-32 relative overflow-hidden
                    transition-all duration-300
                "
                aria-label="Projects Page"
            >
                <div className="relative z-0 w-full max-w-6xl flex flex-col gap-12">
                    {/* Hero */}
                    <header className="flex flex-col items-center gap-6">
                        <h1
                            className="
                                text-4xl sm:text-5xl md:text-6xl font-extrabold font-poiret
                                tracking-tight text-zinc-900 dark:text-zinc-50
                                text-center drop-shadow-2xl
                                transition-all duration-300
                            "
                        >
                            All Projects
                        </h1>
                        <p
                            className="
                                max-w-3xl text-center text-sm md:text-base font-mono
                                text-zinc-600 dark:text-zinc-400
                                bg-zinc-100/70 dark:bg-zinc-900/70
                                px-4 py-3 rounded-2xl shadow-sm
                                transition-all duration-300
                            "
                        >
                            A complete list of my work. Filter, explore, and dive into what I have
                            been building.
                        </p>

                        {/* Filters */}
                        <div className="w-full flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
                            <div className="flex gap-3 flex-1">
                                <input
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search (title, stack, description)..."
                                    className="
                                        flex-1 px-4 py-2.5 rounded-xl
                                        bg-zinc-100 dark:bg-zinc-800
                                        border border-zinc-300 dark:border-zinc-700
                                        text-sm text-zinc-800 dark:text-zinc-100
                                        focus:outline-none focus:ring-2 focus:ring-blue-500/40
                                        transition-all
                                    "
                                    aria-label="Search projects"
                                />
                                <select
                                    value={selectedTag}
                                    onChange={(e) => setSelectedTag(e.target.value)}
                                    className="
                                        w-44 px-3 py-2.5 rounded-xl
                                        bg-zinc-100 dark:bg-zinc-800
                                        border border-zinc-300 dark:border-zinc-700
                                        text-sm text-zinc-800 dark:text-zinc-100
                                        focus:outline-none focus:ring-2 focus:ring-blue-500/40
                                        transition-all
                                    "
                                    aria-label="Filter by tag"
                                >
                                    <option value="">All Tags</option>
                                    {allTags.map((tag) => (
                                        <option key={tag} value={tag}>
                                            {tag}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="text-[11px] font-mono text-zinc-600 dark:text-zinc-400 text-center md:text-right">
                                {filteredProjects.length} / {projectList.length} shown
                            </div>
                        </div>
                    </header>

                    {/* Grid */}
                    <div
                        className="
                            grid gap-8
                            sm:grid-cols-2 xl:grid-cols-3
                            transition-all duration-300
                        "
                        aria-live="polite"
                    >
                        {filteredProjects.map((project) => (
                            <article
                                key={project._id}
                                className="
                                    group relative flex flex-col
                                    rounded-3xl overflow-hidden
                                    border border-zinc-200 dark:border-zinc-800
                                    bg-gradient-to-br from-zinc-100 via-zinc-50 to-zinc-200
                                    dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900
                                    shadow-md hover:shadow-xl
                                    transition-all duration-300
                                    p-5
                                "
                            >
                                <div className="flex flex-col gap-4">
                                    {project.image && (
                                        <div
                                            className="
                                                rounded-2xl overflow-hidden border
                                                border-zinc-200 dark:border-zinc-700
                                                bg-zinc-50 dark:bg-zinc-900
                                                aspect-video flex items-center justify-center
                                            "
                                        >
                                            <img
                                                src={project.image}
                                                alt={project.title}
                                                className="w-full h-full object-contain transition-all duration-300 group-hover:scale-105"
                                                loading="lazy"
                                                draggable="false"
                                            />
                                        </div>
                                    )}
                                    <h2
                                        className="
                                            text-xl font-bold text-blue-900 dark:text-blue-200
                                            tracking-tight leading-snug
                                            transition-all duration-300
                                        "
                                    >
                                        {project.title}
                                    </h2>
                                    <div
                                        className="
                                            text-xs font-mono text-zinc-600 dark:text-zinc-400
                                            leading-relaxed
                                        "
                                    >
                                        <RichText text={project.description} as="div" />
                                    </div>

                                    {project.techStack?.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {project.techStack.map((tech, i) => (
                                                <span
                                                    key={i}
                                                    className="
                                                        text-[10px] font-mono
                                                        bg-zinc-200 dark:bg-zinc-800
                                                        text-zinc-700 dark:text-zinc-200
                                                        px-2 py-1 rounded
                                                    "
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {project.tags?.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {project.tags.map((tag, i) => (
                                                <span
                                                    key={i}
                                                    className="
                                                        text-[10px] font-mono
                                                        bg-blue-100 dark:bg-blue-900
                                                        text-blue-700 dark:text-blue-200
                                                        px-2 py-1 rounded
                                                    "
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex flex-wrap gap-4 pt-2">
                                        {project.liveLink && (
                                            <a
                                                href={project.liveLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="
                                                    text-xs font-semibold underline
                                                    text-green-700 dark:text-green-300
                                                    hover:opacity-80
                                                "
                                            >
                                                Live
                                            </a>
                                        )}
                                        {project.repoLink && (
                                            <a
                                                href={project.repoLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="
                                                    text-xs font-semibold underline
                                                    text-blue-700 dark:text-blue-300
                                                    hover:opacity-80
                                                "
                                            >
                                                Code
                                            </a>
                                        )}
                                        {project.video && (
                                            <a
                                                href={project.video}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="
                                                    text-xs font-semibold underline
                                                    text-purple-700 dark:text-purple-300
                                                    hover:opacity-80
                                                "
                                            >
                                                Video
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </article>
                        ))}

                        {!filteredProjects.length && (
                            <div className="col-span-full flex flex-col items-center gap-4 py-24">
                                <p className="text-sm font-mono text-zinc-600 dark:text-zinc-400">
                                    No projects match the current filters.
                                </p>
                                <button
                                    onClick={() => {
                                        setSearchQuery('');
                                        setSelectedTag('');
                                    }}
                                    className="
                                        text-[11px] font-mono px-3 py-1 rounded
                                        bg-zinc-900 dark:bg-zinc-100
                                        text-zinc-100 dark:text-zinc-900
                                    "
                                >
                                    Reset Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </section>
    );
}

export default Projects;
