import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { submitContactForm, type FormStatus } from '../lib/form';

const BUDGET_OPTIONS = [
    { value: '', label: 'Select a budget range...' },
    { value: '< $2k', label: '< $2k' },
    { value: '$2k - $5k', label: '$2k - $5k' },
    { value: '$5k+', label: '$5k+' },
];

export const ContactForm = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [budget, setBudget] = useState('');
    const [message, setMessage] = useState('');
    const [honeypot, setHoneypot] = useState('');
    const [status, setStatus] = useState<FormStatus>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // If honeypot is filled, silently "succeed" (bot trap)
        if (honeypot) {
            setStatus('success');
            return;
        }

        setStatus('submitting');
        setErrorMessage('');

        const result = await submitContactForm({ name, email, budget, message });

        if (result.success) {
            setStatus('success');
            setName('');
            setEmail('');
            setBudget('');
            setMessage('');
        } else {
            setStatus('error');
            setErrorMessage(result.message || 'Something went wrong. Please try again.');
        }
    };

    if (status === 'success') {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-green-400 font-medium bg-green-400/10 px-6 py-8 rounded-xl border border-green-400/20 text-center"
            >
                <div className="text-2xl mb-2">🎉</div>
                <div className="text-lg font-semibold mb-1">Message Received!</div>
                <p className="text-green-300/80">I'll get back to you within 24-48 hours.</p>
            </motion.div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Honeypot field - hidden from humans, visible to bots */}
            <input
                type="text"
                name="honeypot"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                style={{ display: 'none' }}
                tabIndex={-1}
                autoComplete="off"
            />

            {/* Name Field */}
            <div>
                <label htmlFor="contact-name" className="block text-sm font-medium text-text-muted mb-2">
                    Name <span className="text-primary">*</span>
                </label>
                <input
                    id="contact-name"
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-surface-highlight border border-border rounded-lg px-4 py-3 text-text placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
            </div>

            {/* Email Field */}
            <div>
                <label htmlFor="contact-email" className="block text-sm font-medium text-text-muted mb-2">
                    Email <span className="text-primary">*</span>
                </label>
                <input
                    id="contact-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-surface-highlight border border-border rounded-lg px-4 py-3 text-text placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
            </div>

            {/* Budget Dropdown */}
            <div>
                <label htmlFor="contact-budget" className="block text-sm font-medium text-text-muted mb-2">
                    Budget Range
                </label>
                <select
                    id="contact-budget"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full bg-surface-highlight border border-border rounded-lg px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all cursor-pointer appearance-none"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundPosition: 'right 0.75rem center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '1.5em 1.5em',
                    }}
                >
                    {BUDGET_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Message Textarea */}
            <div>
                <label htmlFor="contact-message" className="block text-sm font-medium text-text-muted mb-2">
                    Tell me about your project
                </label>
                <textarea
                    id="contact-message"
                    placeholder="What are you looking to build? Any specific requirements or timeline?"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    className="w-full bg-surface-highlight border border-border rounded-lg px-4 py-3 text-text placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                />
            </div>

            {/* Error Message */}
            {status === 'error' && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-400 text-sm bg-red-400/10 px-4 py-2 rounded-lg border border-red-400/20"
                >
                    {errorMessage}
                </motion.p>
            )}

            {/* Submit Button */}
            <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full bg-gradient-to-r from-primary to-secondary text-white px-6 py-4 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.02] active:scale-[0.98]"
            >
                {status === 'submitting' ? (
                    <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Sending...
                    </span>
                ) : (
                    "Send Inquiry"
                )}
            </button>
        </form>
    );
};
