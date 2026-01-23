import React from 'react';
import { motion } from 'framer-motion';
import { theme } from '../config/theme';

const stack = [
    { name: "Python", logo: "/images/tech-stack-logos/python-logo.png" },
    { name: "TypeScript", logo: "/images/tech-stack-logos/typescript-logo.png" },
    { name: "React", logo: "/images/tech-stack-logos/react-logo.png" },
    { name: "Astro", logo: "/images/tech-stack-logos/astro-logo.png" },
    { name: "LangChain", logo: "/images/tech-stack-logos/langchain-logo.png" },
    { name: "Remotion", logo: "/images/tech-stack-logos/remotion-logo.png" },
    { name: "SQL", logo: "/images/tech-stack-logos/sql-logo.png" },
    { name: "Docker", logo: "/images/tech-stack-logos/docker-logo.png" },
    { name: "AWS", logo: "/images/tech-stack-logos/aws-logo.png" },
    { name: "Tailwind", logo: "/images/tech-stack-logos/tailwind-logo.png" },
    { name: "Next.js", logo: "/images/tech-stack-logos/next-js-logo.webp" },
    { name: "PostgreSQL", logo: "/images/tech-stack-logos/postgresql-logo.png" },
    { name: "Framer Motion", logo: "/images/tech-stack-logos/framer-motion-logo.png" },
    { name: "OpenAI API", logo: "/images/tech-stack-logos/openai-api-logo.png" },
    { name: "Claude API", logo: "/images/tech-stack-logos/claude-api-logo.svg" },
    { name: "Gemini API", logo: "/images/tech-stack-logos/gemini-api-logo.webp" }
];

const glowColors = [
    theme.colors.primary,
    theme.colors.secondary,
    theme.colors.accent
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
                    {seamlessStack.map((tech, i) => {
                        const glowColor = glowColors[i % glowColors.length];
                        return (
                            <div key={i} className="flex items-center gap-4 group">
                                <img
                                    src={tech.logo}
                                    alt={`${tech.name} logo`}
                                    className="w-8 h-8 md:w-10 md:h-10 object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                                />
                                <span
                                    className="text-3xl md:text-5xl font-bold text-neutral-500 group-hover:text-white transition-all cursor-default select-none"
                                >
                                    <span
                                        className="transition-all duration-300"
                                        style={{
                                            textShadow: `0 0 15px ${glowColor}40` // Subtle permanent glow 
                                        }}
                                    >
                                        {tech.name}
                                    </span>
                                </span>
                            </div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
};
