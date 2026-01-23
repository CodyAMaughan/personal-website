import React from 'react';
import { motion } from 'framer-motion';

const stack = [
    "Python", "TypeScript", "React", "Astro", "LangChain", "Remotion", "SQL", "Docker", "AWS",
    "Tailwind", "Next.js", "PostgreSQL", "Framer Motion", "OpenAI API"
];

export const TechStack = () => {
    // Duplicate the stack to ensure seamless scrolling
    const seamlessStack = [...stack, ...stack, ...stack];

    return (
        <section className="py-20 border-y border-surface-highlight overflow-hidden bg-surface/30 backdrop-blur-sm relative z-0">
            <div className="max-w-6xl mx-auto px-6 mb-10">
                <h3 className="text-sm font-mono text-text-muted uppercase tracking-wider">The Stack</h3>
            </div>

            <div className="flex w-full overflow-hidden mask-gradient-to-r" style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
                <motion.div
                    className="flex gap-12 md:gap-20 whitespace-nowrap items-center"
                    animate={{ x: ["0%", "-33.33%"] }}
                    transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
                >
                    {seamlessStack.map((tech, i) => (
                        <span key={i} className="text-3xl md:text-5xl font-bold text-neutral-500 hover:text-white transition-colors cursor-default select-none">
                            {tech}
                        </span>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};
