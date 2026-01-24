import { motion } from "framer-motion";
import React from "react";

export const AuroraBackground = () => {
    const [isVisible, setIsVisible] = React.useState(false);
    const containerRef = React.useRef(null);

    React.useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            setIsVisible(entry.isIntersecting);
        }, { threshold: 0 });

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div ref={containerRef} className="absolute inset-0 -z-10 w-full overflow-hidden preserve-3d">
            {/* Use opacity instead of conditional render to prevent animation restart */}
            <div className={`transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                {/* 
                    "Liquid" Aurora Effect - Refined
                    - Faster animation (8-12s)
                    - Subtle opacity (0.1-0.3)
                    - 4 Blobs (2 Primary, 2 Secondary)
                    - Positioned below Hero
                */}

                {/* Blob 1: Primary (Cyan) - Top Left */}
                <motion.div
                    initial={{ opacity: 0.15, scale: 0.9, x: -50, y: -50 }}
                    animate={{
                        opacity: [0.3, 0.5, 0.3],
                        scale: [0.9, 1.2, 0.9],
                        x: [-50, 50, -50],
                        y: [-50, 50, -50],
                        rotate: [0, 180, 0],
                        borderRadius: ["20% 80% 20% 80% / 80% 20% 80% 20%", "60% 40% 30% 70% / 60% 30% 70% 40%", "20% 80% 20% 80% / 80% 20% 80% 20%"]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[0%] left-[5%] w-[45vw] h-[45vw] bg-primary/25 blur-[100px] mix-blend-plus-lighter"
                />

                {/* Blob 2: Primary (Cyan) - Bottom Right Duplicate */}
                <motion.div
                    initial={{ opacity: 0.15, scale: 1, x: 50, y: 50 }}
                    animate={{
                        opacity: [0.3, 0.45, 0.3],
                        scale: [1, 1.3, 1],
                        x: [50, -50, 50],
                        y: [50, -50, 50],
                        rotate: [180, 360, 180],
                        borderRadius: ["70% 30% 70% 30% / 30% 70% 30% 70%", "30% 60% 70% 40% / 50% 60% 30% 60%", "70% 30% 70% 30% / 30% 70% 30% 70%"]
                    }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute top-[40%] right-[10%] w-[40vw] h-[40vw] bg-primary/20 blur-[90px] mix-blend-plus-lighter"
                />

                {/* Blob 3: Secondary (Violet) - Top Right */}
                <motion.div
                    initial={{ opacity: 0.2, scale: 0.8, x: 50, y: -50 }}
                    animate={{
                        opacity: [0.35, 0.5, 0.35],
                        scale: [0.8, 1.1, 0.8],
                        x: [50, -50, 50],
                        y: [-50, 50, -50],
                        rotate: [360, 180, 0],
                        borderRadius: ["50% 50% 50% 50%", "30% 70% 70% 30% / 30% 30% 70% 70%", "50% 50% 50% 50%"]
                    }}
                    transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute top-[10%] right-[5%] w-[50vw] h-[50vw] bg-secondary/25 blur-[110px] mix-blend-plus-lighter"
                />

                {/* Blob 4: Secondary (Violet) - Bottom Left */}
                <motion.div
                    initial={{ opacity: 0.15, scale: 0.9, x: -50, y: 50 }}
                    animate={{
                        opacity: [0.3, 0.45, 0.3],
                        scale: [0.9, 1.2, 0.9],
                        x: [-50, 50, -50],
                        y: [50, -50, 50],
                        rotate: [0, -180, 0],
                        borderRadius: ["60% 40% 30% 70% / 60% 30% 70% 40%", "20% 80% 20% 80% / 80% 20% 80% 20%", "60% 40% 30% 70% / 60% 30% 70% 40%"]
                    }}
                    transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    className="absolute top-[50%] left-[10%] w-[45vw] h-[45vw] bg-secondary/20 blur-[100px] mix-blend-plus-lighter"
                />

                {/* Noise Texture */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150 mix-blend-overlay"></div>
            </div>
        </div>
    );
};
