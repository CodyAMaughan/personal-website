import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { submitWaitlistForm, type FormStatus } from '../lib/form';

export const WaitlistForm = ({ product = "General", customColor }: { product?: string; customColor?: string }) => {
    const [email, setEmail] = useState('');
    const [honeypot, setHoneypot] = useState('');
    const [status, setStatus] = useState<FormStatus>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // If honeypot is filled, silently "succeed" (bot trap)
        if (honeypot) {
            setStatus('success');
            return;
        }

        setStatus('submitting');

        const result = await submitWaitlistForm({ email, product });

        if (result.success) {
            setStatus('success');
            setEmail('');
        } else {
            setStatus('error');
        }
    };

    return (
        <div className="w-full">
            {status === 'success' ? (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-green-400 font-medium bg-green-400/10 px-4 py-3 rounded-lg border border-green-400/20 text-center"
                >
                    You're on the list! Watch your inbox.
                </motion.div>
            ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
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
                    <div className="flex gap-2">
                        <input
                            type="email"
                            placeholder="enter your email..."
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-surface-highlight border border-border rounded-lg px-4 py-2 text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <button
                            type="submit"
                            disabled={status === 'submitting'}
                            className="text-white px-5 py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap hover:brightness-110"
                            style={{
                                backgroundColor: customColor || undefined,
                            }}
                        >
                            {status === 'submitting' ? '...' : 'Join Waitlist'}
                        </button>
                    </div>
                    {status === 'error' && <p className="text-red-400 text-sm">Something went wrong. Try again.</p>}
                </form>
            )}
        </div>
    );
};
