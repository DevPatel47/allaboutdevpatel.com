import React, { useState, useMemo, useEffect } from 'react';
import { BgImage } from '../components/components.js';

/**
 * QrCodes Page
 * - Restores QR cards, copy-link behavior and asset resolution
 * - Keeps the existing layout and BgImage usage exactly as it was
 * - No modal, no download buttons (copy only) — consistent with previous requests
 *
 * Notes:
 * - Asset filenames must exist in frontend/src/assets
 * - If you want to add/remove images update ASSET_FILES below
 */

/* --- Configure assets & mapping --- */
const ASSET_FILES = [
    'qrcode-github.png',
    'qrcode-linkedin.png',
    'qrcode-portfolio.png',
    'qrcode-instagram.png',
];

const LINK_MAP = {
    portfolio: 'https://allaboutdevpatel.com/',
    github: 'https://github.com/DevPatel47',
    linkedin: 'https://www.linkedin.com/in/devpatel47/',
    instagram: 'https://www.instagram.com/_.dev47/',
};

/* --- Helpers --- */
function filenameToLabel(filename) {
    return filename
        .replace(/^qrcode-/, '')
        .replace(/\.[^.]+$/, '')
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
}

async function copyToClipboard(text) {
    if (!text) throw new Error('No text to copy');
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        return navigator.clipboard.writeText(text);
    }
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    ta.style.top = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try {
        document.execCommand && document.execCommand('copy');
    } finally {
        document.body.removeChild(ta);
    }
}

/* --- Component --- */
function QrCodes() {
    const [copied, setCopied] = useState(null);

    // resolve asset filenames to bundled URLs
    const qrCodes = useMemo(() => {
        return ASSET_FILES.map((filename) => {
            try {
                const src = new URL(`../../assets/${filename}`, import.meta.url).href;
                return {
                    src,
                    filename,
                    label: filenameToLabel(filename),
                };
            } catch (err) {
                // eslint-disable-next-line no-console
                console.warn('Failed to resolve QR asset:', filename, err);
                return null;
            }
        }).filter(Boolean);
    }, []);

    // copy mapping URL (falls back to image src if mapping missing)
    const handleCopy = async (label, fallback) => {
        const key = String(label || '').toLowerCase();
        const toCopy = LINK_MAP[key] || fallback || '';
        try {
            await copyToClipboard(toCopy);
            setCopied(label);
        } catch {
            setCopied(null);
        }
    };

    // clear copied feedback after 2s
    useEffect(() => {
        if (!copied) return undefined;
        const t = setTimeout(() => setCopied(null), 2000);
        return () => clearTimeout(t);
    }, [copied]);

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
                aria-label="Qr Codes Page"
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
                        <h1 className="w-full heading-section text-center drop-shadow">Qr Codes</h1>

                        {/* QR cards grid (keeps existing layout; added features) */}
                        <div className="w-full">
                            {qrCodes.length === 0 ? (
                                <div className="py-8 text-center text-zinc-600 dark:text-zinc-400">
                                    No QR codes found.
                                </div>
                            ) : (
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                                    {qrCodes.map((q) => (
                                        <li
                                            key={q.filename}
                                            className="flex flex-col items-center gap-4 p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-700"
                                        >
                                            <div className="w-40 h-40 flex items-center justify-center bg-white dark:bg-zinc-900 rounded-md overflow-hidden border border-zinc-200 dark:border-zinc-700">
                                                <img
                                                    src={q.src}
                                                    alt={`${q.label} QR Code`}
                                                    className="w-full h-full object-contain"
                                                    loading="lazy"
                                                    draggable="false"
                                                    width="320"
                                                    height="320"
                                                />
                                            </div>

                                            <div className="text-center w-full">
                                                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                                                    {q.label}
                                                </h3>
                                            </div>

                                            <div className="w-full flex items-center justify-center">
                                                <button
                                                    type="button"
                                                    onClick={() => handleCopy(q.label, q.src)}
                                                    className="px-4 py-2 rounded-full bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 text-sm font-semibold transition-colors whitespace-nowrap"
                                                    aria-label={`Copy ${q.label} profile link`}
                                                >
                                                    {copied === q.label ? 'Copied' : 'Copy Link'}
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </section>
                </div>
            </main>
        </section>
    );
}

export default QrCodes;
