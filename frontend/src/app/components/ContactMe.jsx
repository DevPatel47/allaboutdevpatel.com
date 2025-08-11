import React, { useState } from 'react';
import { AnimatedBlurDots } from './components.js';

function ContactMe() {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [status, setStatus] = useState({ sending: false, ok: null, msg: '' });

    const onChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const canSubmit =
        form.name.trim() && form.email.trim() && form.subject.trim() && form.message.trim();

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!canSubmit || status.sending) return;
        try {
            setStatus({ sending: true, ok: null, msg: '' });
            const res = await fetch('/api/v1/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed');
            setStatus({ sending: false, ok: true, msg: 'Message sent successfully.' });
            setForm({ name: '', email: '', subject: '', message: '' });
        } catch (err) {
            setStatus({ sending: false, ok: false, msg: err.message || 'Error sending message.' });
        }
    };

    return (
        <section
            className="
                w-full flex items-center justify-center
                bg-zinc-50 dark:bg-zinc-950
                px-4 pt-16 relative
                transition-all duration-300
            "
            aria-label="Contact Me Section"
        >
            <AnimatedBlurDots count={18} />
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
                    ✉️ Contact Me
                </h3>
                <form
                    onSubmit={onSubmit}
                    className="
                        w-full flex flex-col gap-4
                        p-6 bg-zinc-50/95 dark:bg-zinc-900/90 rounded-3xl
                        shadow-md hover:shadow-lg transition-shadow duration-300
                        border border-zinc-200 dark:border-zinc-800
                        relative z-10
                    "
                    noValidate
                >
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="name"
                            className="text-xs font-mono text-zinc-600 dark:text-zinc-400"
                        >
                            Name
                        </label>
                        <input
                            id="name"
                            name="name"
                            value={form.name}
                            onChange={onChange}
                            className="
                                w-full px-3 py-2 rounded-lg
                                bg-zinc-100 dark:bg-zinc-800
                                text-sm md:text-base
                                text-zinc-800 dark:text-zinc-100
                                border border-zinc-200 dark:border-zinc-700
                                focus:outline-none focus:ring-2 focus:ring-blue-500/50
                                transition-all duration-300
                            "
                            placeholder="Your name"
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="email"
                            className="text-xs font-mono text-zinc-600 dark:text-zinc-400"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={onChange}
                            className="
                                w-full px-3 py-2 rounded-lg
                                bg-zinc-100 dark:bg-zinc-800
                                text-sm md:text-base
                                text-zinc-800 dark:text-zinc-100
                                border border-zinc-200 dark:border-zinc-700
                                focus:outline-none focus:ring-2 focus:ring-blue-500/50
                                transition-all duration-300
                            "
                            placeholder="you@example.com"
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="subject"
                            className="text-xs font-mono text-zinc-600 dark:text-zinc-400"
                        >
                            Subject
                        </label>
                        <input
                            id="subject"
                            name="subject"
                            value={form.subject}
                            onChange={onChange}
                            className="
                                w-full px-3 py-2 rounded-lg
                                bg-zinc-100 dark:bg-zinc-800
                                text-sm md:text-base
                                text-zinc-800 dark:text-zinc-100
                                border border-zinc-200 dark:border-zinc-700
                                focus:outline-none focus:ring-2 focus:ring-blue-500/50
                                transition-all duration-300
                            "
                            placeholder="Subject"
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="message"
                            className="text-xs font-mono text-zinc-600 dark:text-zinc-400"
                        >
                            Message
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            rows="5"
                            value={form.message}
                            onChange={onChange}
                            className="
                                w-full px-3 py-2 rounded-lg resize-y
                                bg-zinc-100 dark:bg-zinc-800
                                text-sm md:text-base
                                text-zinc-800 dark:text-zinc-100
                                border border-zinc-200 dark:border-zinc-700
                                focus:outline-none focus:ring-2 focus:ring-blue-500/50
                                transition-all duration-300
                            "
                            placeholder="How can I help you?"
                            required
                        />
                    </div>
                    {status.msg && (
                        <p
                            className={`text-xs font-mono ${
                                status.ok
                                    ? 'text-green-700 dark:text-green-400'
                                    : 'text-red-600 dark:text-red-400'
                            }`}
                        >
                            {status.msg}
                        </p>
                    )}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={!canSubmit || status.sending}
                            className="
                                relative h-11 px-6 py-2.5
                                overflow-hidden rounded-lg
                                text-sm md:text-base font-semibold
                                bg-zinc-900 dark:bg-zinc-50
                                text-zinc-50 dark:text-zinc-900
                                transition-all duration-300
                                disabled:opacity-50 disabled:cursor-not-allowed
                                hover:bg-zinc-800 dark:hover:bg-zinc-200
                                ring-0 hover:ring-2 hover:ring-zinc-800 dark:hover:ring-zinc-200
                                hover:ring-offset-2 dark:hover:ring-offset-zinc-950
                            "
                            aria-busy={status.sending}
                        >
                            {status.sending ? 'Sending...' : 'Send Message'}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}

export default ContactMe;
