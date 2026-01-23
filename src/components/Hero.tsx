import React from 'react';
import { motion } from 'framer-motion';
import { HeroBackground } from './HeroBackground';

export const Hero = () => {
    return (
        <section className="min-h-[90vh] flex items-center justify-center w-full relative overflow-hidden py-20">
            <HeroBackground />

            <div className="w-full max-w-6xl mx-auto px-6 z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="relative p-8 md:p-12 rounded-card bg-surface border border-border backdrop-blur-xl shadow-2xl"
                >
                    <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
                        {/* Headshot Column */}
                        <div className="shrink-0 relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
                            <img
                                src="/images/cody-maughan-headshot.jpeg"
                                alt="Cody Maughan"
                                className="relative h-48 w-48 md:h-64 md:w-64 rounded-full object-cover border-4 border-surface shadow-2xl"
                            />
                        </div>

                        {/* Content Column */}
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                                </span>
                                <span className="text-primary font-mono text-sm tracking-wide uppercase font-semibold">
                                    Technical Founder & Product Engineer
                                </span>
                            </div>

                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
                                Building the future of <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent animate-gradient-x">
                                    Agentic AI & SaaS.
                                </span>
                            </h1>

                            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-8 leading-relaxed font-sans mx-auto md:mx-0">
                                I’m <strong className="text-white font-semibold">Cody Maughan</strong>. I bridge the gap between Enterprise Data Science and Creative Product Engineering. Currently building AI-powered video tools and medical coding solutions.
                            </p>

                            <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                <button
                                    onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="bg-primary text-black hover:bg-primary-hover px-8 py-3 rounded-lg font-bold transition-all shadow-lg hover:shadow-primary/25"
                                >
                                    View Work
                                </button>
                                <a
                                    href="/about"
                                    className="bg-zinc-800 hover:bg-zinc-700 border border-border hover:border-border-highlight text-white px-8 py-3 rounded-lg font-medium transition-colors"
                                >
                                    About Me
                                </a>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
