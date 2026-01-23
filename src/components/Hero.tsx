import React from 'react';
import { motion } from 'framer-motion';

export const Hero = () => {
    return (
        <section className="min-h-[80vh] flex flex-col justify-center max-w-4xl mx-auto px-6 py-20 relative">

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <div className="flex items-center gap-2 mb-6">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                    </span>
                    <span className="text-primary font-mono text-sm tracking-wide uppercase">
                        Technical Founder & Product Engineer
                    </span>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
                    Building the future of <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent animate-gradient-x">
                        Agentic AI & SaaS.
                    </span>
                </h1>
            </motion.div>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                className="text-xl text-text-muted max-w-2xl mb-10 leading-relaxed"
            >
                I’m <strong className="text-white font-semibold">Cody Maughan</strong>. I bridge the gap between Enterprise Data Science and Creative Product Engineering. Currently building AI-powered video tools and medical coding solutions.
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                className="flex flex-wrap gap-4"
            >
                <button
                    onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                    className="bg-white text-black hover:bg-zinc-200 px-8 py-3 rounded-lg font-semibold transition-colors shadow-lg shadow-white/5"
                >
                    View Work
                </button>
                <a
                    href="/about"
                    className="bg-surface-highlight hover:bg-surface border border-border text-white px-8 py-3 rounded-lg font-medium transition-colors hover:border-primary/50"
                >
                    About Me
                </a>
            </motion.div>
        </section>
    );
};
