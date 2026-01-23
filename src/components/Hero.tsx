import React from 'react';
import { motion } from 'framer-motion';
import { HeroBackground } from './HeroBackground';

export const Hero = () => {
    return (
        <section className="min-h-[80vh] flex flex-col justify-center max-w-4xl mx-auto px-6 py-20 relative overflow-hidden">
            <HeroBackground />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="relative z-10 p-8 md:p-12 rounded-card bg-surface/80 border border-border backdrop-blur-md shadow-2xl skew-y-0"
            >
                <div className="flex items-center gap-3 mb-6">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                    </span>
                    <span className="text-primary font-mono text-sm tracking-wide uppercase font-semibold">
                        Technical Founder & Product Engineer
                    </span>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-text mb-6 leading-[1.1]">
                    Building the future of <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent animate-gradient-x">
                        Agentic AI & SaaS.
                    </span>
                </h1>

                <p className="text-lg md:text-xl text-text-muted max-w-2xl mb-10 leading-relaxed font-sans">
                    I’m <strong className="text-white font-semibold">Cody Maughan</strong>. I bridge the gap between Enterprise Data Science and Creative Product Engineering. Currently building AI-powered video tools and medical coding solutions.
                </p>

                <div className="flex flex-wrap gap-4">
                    <button
                        onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                        className="bg-primary text-black hover:bg-primary-hover px-8 py-3 rounded-lg font-bold transition-all shadow-lg hover:shadow-primary/25"
                    >
                        View Work
                    </button>
                    <a
                        href="/about"
                        className="bg-surface hover:bg-surface-highlight border border-border hover:border-border-highlight text-text px-8 py-3 rounded-lg font-medium transition-colors"
                    >
                        About Me
                    </a>
                </div>
            </motion.div>
        </section>
    );
};
