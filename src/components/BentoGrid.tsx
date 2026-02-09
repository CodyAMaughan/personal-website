import React from 'react';
import { motion } from 'framer-motion';
import { WaitlistForm } from './WaitlistForm';
import { ProjectBackground } from './ProjectBackground';
import { ArrowRight } from 'lucide-react';
import { PROJECTS, type Project } from '../data/projects';

const Card = ({ project, optimizedLogo }: { project: Project, optimizedLogo?: string }) => {
    const divRef = React.useRef<HTMLDivElement>(null);
    const [isFocused, setIsFocused] = React.useState(false);
    const [position, setPosition] = React.useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = React.useState(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!divRef.current) return;
        const rect = divRef.current.getBoundingClientRect();
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleFocus = () => {
        setIsFocused(true);
        setOpacity(1);
    };

    const handleBlur = () => {
        setIsFocused(false);
        setOpacity(0);
    };

    const handleMouseEnter = () => {
        setOpacity(1);
    };

    const handleMouseLeave = () => {
        setOpacity(0);
    };

    // Assuming project.icon is still a React.ElementType from the imported Project type
    const Icon = project.icon;
    const isExternalLink = !!project.link?.startsWith('http');

    return (
        <motion.div
            ref={divRef}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            onMouseMove={handleMouseMove}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`
                group relative p-8 h-full flex flex-col justify-between
                backdrop-blur-xl
                border border-white/5
                overflow-hidden
                rounded-[1.5rem]
                transition-all duration-500
                shadow-2xl
            `}
            style={{
                // Base background mixing surface with primary color - Increased opacity to 0.25 (25)
                background: `linear-gradient(145deg, ${project.primaryColor}25, rgba(10, 10, 10, 0.4) 60%)`,
                borderColor: opacity > 0 ? `${project.primaryColor}50` : 'rgba(255,255,255,0.05)',
                boxShadow: opacity > 0 ? `0 0 30px -10px ${project.secondaryColor}30` : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}
        >
            {/* Spotlight Border Effect */}
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                    opacity,
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${project.secondaryColor}20, transparent 40%)`,
                }}
            />

            {/* Content Top */}
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 flex items-center justify-center rounded-xl bg-surface border border-white/10 overflow-hidden shadow-lg group-hover:scale-105 transition-transform duration-300">
                            {project.logo ? (
                                <img
                                    src={optimizedLogo || project.logo}
                                    alt={`${project.title} Logo`}
                                    className={`w-full h-full object-cover ${project.logoIsExternal ? 'p-0' : 'p-0'}`}
                                />
                            ) : (
                                <Icon className="w-6 h-6" style={{ color: project.primaryColor }} />
                            )}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all">
                                {project.title}
                            </h3>
                            <div className="flex gap-2 mt-1">
                                {project.tags.map(tag => (
                                    <span key={tag} className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-white/5 text-text-muted border border-white/5">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <p className="text-text-muted text-sm leading-relaxed mb-8 border-l-2 pl-4" style={{ borderColor: `${project.secondaryColor}40` }}>
                    {project.hook}
                </p>
            </div>

            {/* Content Bottom */}
            <div className="relative z-10 mt-auto">
                {project.isWaitlist ? (
                    <WaitlistForm product={project.title} customColor={project.primaryColor} />
                ) : (
                    project.link && (
                        <a
                            href={project.link}
                            target={isExternalLink ? '_blank' : undefined}
                            rel={isExternalLink ? 'noopener noreferrer' : undefined}
                            className="inline-flex items-center gap-2 text-sm font-bold transition-transform group-hover:translate-x-1"
                            style={{ color: project.primaryColor }}
                        >
                            Visit Project <ArrowRight className="w-4 h-4" />
                        </a>
                    )
                )}
            </div>
        </motion.div>
    );
};

export const BentoGrid = ({ optimizedLogos = {} }: { optimizedLogos?: Record<string, string> }) => {
    // Filter featured projects
    const featuredProjects = PROJECTS.filter(p => p.featured).slice(0, 4);

    return (
        <section id="projects" className="relative w-full py-24 overflow-hidden">
            {/* Unique Background for this section */}
            <ProjectBackground />

            <div className="relative z-10 max-w-6xl mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                            Selected Work
                        </h2>
                        <p className="text-text-muted max-w-lg text-lg">
                            A showcase of technical products bridging AI, Blockchain, and Healthcare.
                        </p>
                    </div>

                    <a href="/projects" className="hidden md:flex items-center gap-2 text-text-muted hover:text-white transition-colors group">
                        See all projects
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-fr">
                    {featuredProjects.map((project, idx) => (
                        <Card key={idx} project={project} optimizedLogo={optimizedLogos[project.title]} />
                    ))}
                </div>

                <div className="mt-12 md:hidden flex justify-center">
                    <a href="/projects" className="flex items-center gap-2 text-text-muted hover:text-white transition-colors">
                        See all projects
                        <ArrowRight className="w-4 h-4" />
                    </a>
                </div>
            </div>
        </section>
    );
};
