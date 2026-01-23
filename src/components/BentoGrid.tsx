import React from 'react';
import { motion } from 'framer-motion';
import { WaitlistForm } from './WaitlistForm';

interface Project {
    title: string;
    description: string;
    link?: string;
    tags: string[];
    className?: string;
    isWaitlist?: boolean;
    isGraveyard?: boolean;
}

const featuredProjects: Project[] = [
    {
        title: "ProCode",
        description: "Review automated medical coding with confidence. A SaaS for enterprise healthcare data quality.",
        link: "https://procode.health",
        tags: ["SaaS", "Healthcare", "AI"],
        className: "md:col-span-2 bg-gradient-to-br from-surface-highlight to-surface",
    },
    {
        title: "GhostWriter",
        description: "A peer-to-peer party game where AI Agents play along. Who can fool the humans?",
        link: "https://playghostwriter.online",
        tags: ["Game Dev", "Agents", "Realtime"],
        className: "md:col-span-1",
    },
    {
        title: "AutoReel",
        description: "An Agentic AI video editor built with Remotion. Currently in private beta.",
        tags: ["Remotion", "Video AI", "Tool"],
        isWaitlist: true,
        className: "md:col-span-2 md:row-span-1 border-primary/20",
    },
    {
        title: "Autograph (Bunked)",
        description: "Blockchain media authentication platform. No longer active.",
        link: "https://bunked.ai",
        tags: ["Blockchain", "Web3", "Graveyard"],
        isGraveyard: true,
        className: "md:col-span-1 opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0",
    }
];

const Card = ({ project }: { project: Project }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className={`
                group relative p-8 rounded-2xl border border-border bg-surface-highlight overflow-hidden flex flex-col justify-between
                ${project.className || "md:col-span-1"}
                ${project.isWaitlist ? "hover:border-primary/50" : "hover:border-border"}
                transition-all duration-300
            `}
        >
            {/* Spotlight Effect helper (simplified) */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            <div>
                <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map(tag => (
                        <span key={tag} className="text-xs font-medium px-2 py-1 rounded-full bg-white/5 border border-white/5 text-text-muted">
                            {tag}
                        </span>
                    ))}
                </div>

                <h3 className={`text-2xl font-bold mb-2 ${project.isGraveyard ? 'text-text-muted decoration-line-through' : 'text-white'}`}>
                    {project.title}
                </h3>

                <p className="text-text-muted mb-6 leading-relaxed">
                    {project.description}
                </p>
            </div>

            <div className="mt-auto">
                {project.isWaitlist ? (
                    <WaitlistForm product={project.title} />
                ) : (
                    project.link && (
                        <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-primary font-medium hover:text-primary-hover group-hover:translate-x-1 transition-transform"
                        >
                            Visit Project -&gt;
                        </a>
                    )
                )}
            </div>
        </motion.div>
    );
};

export const BentoGrid = () => {
    return (
        <section id="projects" className="max-w-6xl mx-auto px-6 py-20">
            <h2 className="text-3xl font-bold text-white mb-12">Selected Work</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr">
                {featuredProjects.map((project, idx) => (
                    <Card key={idx} project={project} />
                ))}
            </div>
        </section>
    );
};
