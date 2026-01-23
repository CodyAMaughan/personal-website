import React from 'react';
import { motion } from 'framer-motion';
import { HeroBackground } from './HeroBackground';

interface ErrorHeroProps {
    code?: string;
    title?: string;
    description?: string;
    actionLabel?: string;
    actionLink?: string;
}

export const ErrorHero: React.FC<ErrorHeroProps> = ({
    code = "404",
    title = "Page Not Found",
    description = "The page you're looking for seems to have drifted into the digital void.",
    actionLabel = "Return Home",
    actionLink = "/"
}) => {
    return (
        <section className="min-h-[90vh] flex items-center justify-center w-full relative overflow-hidden py-20">
            {/* Reusing the same background for consistency */}
            <HeroBackground />

            <div className="w-full max-w-4xl mx-auto px-6 z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="relative p-12 md:p-20 pb-20 md:pb-32 rounded-card bg-surface border border-border backdrop-blur-xl shadow-2xl"
                >
                    {/* Glowing Error Code or Title */}
                    <div className="relative mb-8 inline-block">
                        <div className="absolute -inset-10 bg-primary/20 rounded-full blur-3xl opacity-50"></div>
                        <h1 className="relative text-7xl md:text-9xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-primary via-white to-secondary select-none">
                            {code}
                        </h1>
                        <div className="mt-2 text-2xl md:text-3xl font-mono text-primary/80 font-bold uppercase tracking-widest">
                            {title}
                        </div>
                    </div>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-12 leading-relaxed font-sans"
                    >
                        {description}
                    </motion.p>

                    {/* Action Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                    >
                        <a
                            href={actionLink}
                            className="inline-flex items-center justify-center bg-primary text-black hover:bg-primary-hover px-10 py-4 rounded-lg font-bold transition-all shadow-lg hover:shadow-primary/25 group text-lg"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            {actionLabel}
                        </a>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};
