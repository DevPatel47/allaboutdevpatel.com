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

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        try {
            setStatus({ sending: true, ok: null, msg: '' });

            const apiUrl = '/api/v1/contact';

            console.log('Sending request to:', apiUrl);
            console.log('Request payload:', form);

            const res = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(form),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            console.log('Response status:', res.status);

            // Handle non-JSON responses (like HTML error pages)
            const contentType = res.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const textResponse = await res.text();
                console.error('Non-JSON response:', textResponse);

                if (textResponse.includes('504 Gateway Time-out')) {
                    throw new Error('Server timeout - please try again in a few moments');
                } else if (textResponse.includes('502 Bad Gateway')) {
                    throw new Error('Server is temporarily unavailable');
                } else {
                    throw new Error('Server error - please try again later');
                }
            }

            const data = await res.json();
            console.log('Response data:', data);

            if (!res.ok) {
                throw new Error(data.message || `Server error: ${res.status}`);
            }

            // Handle successful response
            let successMessage = 'Message sent successfully!';

            // Check if it was sent via Web3Forms or fallback
            if (data.data?.fallback) {
                successMessage = 'Message received! We will get back to you soon.';
            } else if (data.data?.provider === 'Web3Forms') {
                successMessage = 'Message sent successfully via Web3Forms!';
            }

            setStatus({ sending: false, ok: true, msg: successMessage });
            setForm({ name: '', email: '', subject: '', message: '' });
        } catch (err) {
            clearTimeout(timeoutId);
            console.error('Contact form error:', err);

            let errorMessage = 'Error sending message.';

            if (err.name === 'AbortError') {
                errorMessage = 'Request timed out. Please try again.';
            } else if (err.message.includes('fetch') || err.message.includes('network')) {
                errorMessage = 'Network error. Please check your connection and try again.';
            } else if (err.message.includes('timeout')) {
                errorMessage = 'Server is taking too long to respond. Please try again.';
            } else if (err.message) {
                errorMessage = err.message;
            }

            setStatus({ sending: false, ok: false, msg: errorMessage });
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
                <h3 className="heading-section mb-6 text-zinc-900 dark:text-zinc-50 text-center tracking-tight drop-shadow transition-all duration-300">
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
                        <label htmlFor="name" className="text-meta">
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
                        <label htmlFor="email" className="text-meta">
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
                        <label htmlFor="subject" className="text-meta">
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
                        <label htmlFor="message" className="text-meta">
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
                        <div
                            className={`p-3 rounded-lg text-sm ${
                                status.ok
                                    ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
                                    : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800'
                            }`}
                        >
                            {status.msg}
                        </div>
                    )}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={!canSubmit || status.sending}
                            className="
                                px-6 py-3 rounded-xl
                                text-sm md:text-base font-semibold
                                bg-zinc-900 dark:bg-zinc-50
                                text-zinc-50 dark:text-zinc-900
                                hover:bg-zinc-800 dark:hover:bg-zinc-200
                                disabled:opacity-50 disabled:cursor-not-allowed
                                transition-colors duration-200
                                min-w-[120px]
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
