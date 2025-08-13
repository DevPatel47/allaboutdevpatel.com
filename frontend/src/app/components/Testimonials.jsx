import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { AnimatedBlurDots, RichText } from './components.js';
import TestimonialService from '../services/portfolio/testimonial.service.js';

/**
 * Testimonials Component
 * Displays testimonials and allows creating a new testimonial for the current portfolio user.
 */
function Testimonials({ testimonials = [], userId }) {
    const [items, setItems] = useState(testimonials);
    const [openForm, setOpenForm] = useState(false);
    const [sending, setSending] = useState(false);
    const [msg, setMsg] = useState({ ok: null, text: '' });
    const [form, setForm] = useState({
        name: '',
        role: '',
        content: '',
        linkedIn: '',
        image: null,
    });

    useEffect(() => {
        setItems(testimonials);
    }, [testimonials]);

    const onChange = (e) => {
        const { name, value, files } = e.target;
        setForm((f) => ({ ...f, [name]: files ? files[0] : value }));
    };

    const canSubmit =
        form.name.trim() && form.role.trim() && form.content.trim() && !sending && userId;

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!canSubmit) return;
        try {
            setSending(true);
            setMsg({ ok: null, text: '' });
            const fd = new FormData();
            fd.append('name', form.name.trim());
            fd.append('role', form.role.trim());
            fd.append('content', form.content.trim());
            if (form.linkedIn.trim()) fd.append('linkedIn', form.linkedIn.trim());
            if (form.image) fd.append('image', form.image);
            const created = await TestimonialService.create(userId, fd);
            setItems((prev) => [created, ...prev]);
            setForm({ name: '', role: '', content: '', linkedIn: '', image: null });
            setMsg({ ok: true, text: 'Submitted.' });
            setOpenForm(false);
        } catch (err) {
            setMsg({ ok: false, text: err.message || 'Failed.' });
        } finally {
            setSending(false);
        }
    };

    if (!items.length && !userId) return null;

    return (
        <section
            className="
                w-full flex items-center justify-center
                bg-zinc-50 dark:bg-zinc-950
                px-4 pt-16 relative
                transition-all duration-300
            "
            aria-label="Testimonials Section"
        >
            <AnimatedBlurDots count={14} />
            <div
                className="
                    relative z-0 p-6
                    flex flex-col
                    items-center
                    w-full max-w-5xl
                    transition-all duration-300
                "
            >
                <h3
                    className="
                        text-4xl md:text-5xl font-extrabold font-poiret mb-6
                        text-zinc-900 dark:text-zinc-50
                        text-center tracking-tight drop-shadow
                        transition-all duration-300
                    "
                >
                    💬 Testimonials
                </h3>

                {/* Create Form Toggle */}
                {userId && (
                    <button
                        type="button"
                        onClick={() => setOpenForm((o) => !o)}
                        className="
                            mb-4 self-end text-xs font-mono px-3 py-1 rounded
                            bg-zinc-900 dark:bg-zinc-100
                            text-zinc-100 dark:text-zinc-900
                            hover:bg-zinc-800 dark:hover:bg-zinc-200
                            transition-all duration-300
                        "
                    >
                        {openForm ? 'Close' : 'Add Testimonial'}
                    </button>
                )}

                {openForm && (
                    <form
                        onSubmit={onSubmit}
                        className="
                            w-full flex flex-col gap-4 mb-8
                            p-6 bg-zinc-50/95 dark:bg-zinc-900/90 rounded-3xl
                            shadow-md hover:shadow-lg transition-shadow duration-300
                            border border-zinc-200 dark:border-zinc-800
                            relative z-10
                        "
                        noValidate
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-mono text-zinc-600 dark:text-zinc-400">
                                    Name
                                </label>
                                <input
                                    name="name"
                                    value={form.name}
                                    onChange={onChange}
                                    className="px-3 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-sm border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-mono text-zinc-600 dark:text-zinc-400">
                                    Role
                                </label>
                                <input
                                    name="role"
                                    value={form.role}
                                    onChange={onChange}
                                    className="px-3 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-sm border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-1 md:col-span-2">
                                <label className="text-xs font-mono text-zinc-600 dark:text-zinc-400">
                                    LinkedIn (optional)
                                </label>
                                <input
                                    name="linkedIn"
                                    value={form.linkedIn}
                                    onChange={onChange}
                                    className="px-3 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-sm border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                    placeholder="https://www.linkedin.com/in/username"
                                />
                            </div>
                            <div className="flex flex-col gap-1 md:col-span-2">
                                <label className="text-xs font-mono text-zinc-600 dark:text-zinc-400">
                                    Content
                                </label>
                                <textarea
                                    name="content"
                                    rows="4"
                                    value={form.content}
                                    onChange={onChange}
                                    className="px-3 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-sm border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-y"
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-1 md:col-span-2">
                                <label className="text-xs font-mono text-zinc-600 dark:text-zinc-400">
                                    Image (optional)
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    name="image"
                                    onChange={onChange}
                                    className="text-xs"
                                />
                            </div>
                        </div>
                        {msg.text && (
                            <p
                                className={`text-xs font-mono ${
                                    msg.ok
                                        ? 'text-green-700 dark:text-green-400'
                                        : 'text-red-600 dark:text-red-400'
                                }`}
                            >
                                {msg.text}
                            </p>
                        )}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={!canSubmit}
                                className="
                                    h-10 px-6 rounded-lg text-sm font-semibold
                                    bg-zinc-900 dark:bg-zinc-50
                                    text-zinc-50 dark:text-zinc-900
                                    disabled:opacity-50 disabled:cursor-not-allowed
                                    hover:bg-zinc-800 dark:hover:bg-zinc-200
                                    transition-all duration-300
                                "
                            >
                                {sending ? 'Submitting...' : 'Submit'}
                            </button>
                        </div>
                    </form>
                )}

                <div className="w-full flex flex-col items-center gap-6">
                    {items.map((t) => (
                        <div
                            key={t._id}
                            className="
                                flex flex-col md:flex-row items-center gap-4 w-full
                                p-6 bg-zinc-50/95 dark:bg-zinc-900/90 rounded-3xl
                                shadow-md hover:shadow-lg transition-shadow duration-300
                                border border-zinc-200 dark:border-zinc-800
                                relative z-10
                            "
                        >
                            {t.image && (
                                <img
                                    src={t.image}
                                    alt={t.name}
                                    className="
                                        w-24 h-24 object-cover rounded-xl
                                        border border-zinc-200 dark:border-zinc-700
                                        mb-2 md:mb-0
                                    "
                                    loading="lazy"
                                    draggable="false"
                                />
                            )}
                            <div className="flex-1 flex flex-col items-center md:items-start">
                                <h4 className="font-bold text-lg md:text-2xl text-blue-900 dark:text-blue-200 mb-1 text-center md:text-left transition-all duration-300">
                                    {t.name}
                                </h4>
                                <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400 mb-2 text-center md:text-left">
                                    {t.role}
                                </p>
                                <div className="text-sm md:text-base text-zinc-700 dark:text-zinc-300 mb-2 text-center md:text-left">
                                    <RichText text={t.content} as="div" />
                                </div>
                                {t.linkedIn && (
                                    <a
                                        href={t.linkedIn}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-blue-700 dark:text-blue-300 underline break-all"
                                    >
                                        LinkedIn
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                    {!items.length && (
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 font-mono">
                            No testimonials yet.
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
}

Testimonials.propTypes = {
    testimonials: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            name: PropTypes.string.isRequired,
            role: PropTypes.string.isRequired,
            content: PropTypes.string.isRequired,
            image: PropTypes.string,
            linkedIn: PropTypes.string,
        }),
    ),
    userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default Testimonials;
