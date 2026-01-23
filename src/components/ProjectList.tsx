import React from 'react';
import { motion } from 'framer-motion';
import { WaitlistForm } from './WaitlistForm';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { PROJECTS } from '../data/projects';

export const ProjectList = () => {
    return (
        <section className="relative w-full min-h-screen py-24 md:py-32 px-6 overflow-hidden">
            <div className="relative z-10 max-w-4xl mx-auto">
                <div className="mb-12">
                    <a href="/" className="inline-flex items-center gap-2 text-text-muted hover:text-white transition-colors mb-8 group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </a>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        All Projects
                    </h1>
                    <p className="text-xl text-text-muted max-w-2xl leading-relaxed">
                        A complete archive of experiments, products, and tools I've built.
                    </p>
                </div>

                <div className="flex flex-col gap-12">
                    {PROJECTS.map((project, idx) => (
                        <div
                            key={idx}
                            className="relative group p-8 md:p-10 rounded-[2rem] bg-surface/30 backdrop-blur-xl border border-white/5 overflow-hidden transition-all hover:bg-surface/50"
                        >
                            {/* Background Tint */}
                            <div
                                className="absolute inset-0 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity duration-500"
                                style={{ background: `linear-gradient(to right, ${project.primaryColor}, transparent)` }}
                            />

                            {/* Top Row: Logo & Title */}
                            <div className="relative z-10 flex flex-col md:flex-row md:items-start gap-6 mb-8">
                                <div className="shrink-0 w-16 h-16 rounded-2xl bg-surface border border-white/10 flex items-center justify-center overflow-hidden shadow-lg">
                                    {project.logo ? (
                                        <img
                                            src={project.logo}
                                            alt={project.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <project.icon className="w-8 h-8" style={{ color: project.primaryColor }} />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-3 mb-2">
                                        <h2 className="text-3xl font-bold text-white">
                                            {project.title}
                                        </h2>
                                        <div className="flex gap-2">
                                            {project.tags.map(tag => (
                                                <span key={tag} className="text-xs font-mono font-medium px-2 py-1 rounded-full bg-white/5 border border-white/5 text-text-muted uppercase tracking-wider">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-lg text-white/90 font-medium leading-relaxed max-w-2xl">
                                        {project.hook}
                                    </p>
                                </div>
                            </div>

                            {/* Middle: Long Description */}
                            <div className="relative z-10 pl-0 md:pl-[5.5rem] mb-8">
                                <p className="text-text-muted leading-7">
                                    {project.description}
                                </p>
                            </div>

                            {/* Bottom: Action */}
                            <div className="relative z-10 pl-0 md:pl-[5.5rem]">
                                {project.isWaitlist ? (
                                    <div className="max-w-sm">
                                        <WaitlistForm product={project.title} customColor={project.primaryColor} />
                                    </div>
                                ) : (
                                    project.link && (
                                        <a
                                            href={project.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-black transition-transform hover:scale-105"
                                            style={{ backgroundColor: project.primaryColor }}
                                        >
                                            Visit Project <ArrowRight className="w-4 h-4" />
                                        </a>
                                    )
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
