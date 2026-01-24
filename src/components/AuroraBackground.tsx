import React, { useEffect, useRef } from 'react';

// Theme colors hardcoded for canvas performance
const COLORS = {
    primary: '#4ade80',    // Green
    secondary: '#3b82f6',  // Blue
};

interface Blob {
    x: number;
    y: number;
    baseX: number;
    baseY: number;
    radius: number;
    color: string;
    speed: number;
    offset: number;
    opacity: number;
}

export const AuroraBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let width: number;
        let height: number;
        let isVisible = true;

        // Create blobs similar to the original Framer Motion ones
        const blobs: Blob[] = [];

        const init = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;

            // Initialize blobs (matching original positions)
            blobs.length = 0;
            blobs.push({
                baseX: width * 0.25,
                baseY: height * 0.2,
                x: width * 0.25,
                y: height * 0.2,
                radius: Math.min(width, height) * 0.35,
                color: COLORS.primary,
                speed: 0.8,
                offset: 0,
                opacity: 0.18
            });
            blobs.push({
                baseX: width * 0.7,
                baseY: height * 0.6,
                x: width * 0.7,
                y: height * 0.6,
                radius: Math.min(width, height) * 0.32,
                color: COLORS.primary,
                speed: 0.6,
                offset: Math.PI * 0.5,
                opacity: 0.15
            });
            blobs.push({
                baseX: width * 0.8,
                baseY: height * 0.25,
                x: width * 0.8,
                y: height * 0.25,
                radius: Math.min(width, height) * 0.38,
                color: COLORS.secondary,
                speed: 0.7,
                offset: Math.PI,
                opacity: 0.18
            });
            blobs.push({
                baseX: width * 0.3,
                baseY: height * 0.7,
                x: width * 0.3,
                y: height * 0.7,
                radius: Math.min(width, height) * 0.35,
                color: COLORS.secondary,
                speed: 0.65,
                offset: Math.PI * 1.5,
                opacity: 0.15
            });
        };

        const render = (time: number) => {
            if (!isVisible) return;

            const t = time * 0.001; // Convert to seconds

            // Clear with transparent background
            ctx.clearRect(0, 0, width, height);

            // Update and draw each blob
            blobs.forEach(blob => {
                // Gentle floating motion
                blob.x = blob.baseX + Math.sin(t * blob.speed + blob.offset) * 80;
                blob.y = blob.baseY + Math.cos(t * blob.speed * 0.8 + blob.offset) * 60;

                // Create radial gradient for soft blob effect
                const gradient = ctx.createRadialGradient(
                    blob.x, blob.y, 0,
                    blob.x, blob.y, blob.radius
                );

                // Parse hex color to RGB for alpha support
                const r = parseInt(blob.color.slice(1, 3), 16);
                const g = parseInt(blob.color.slice(3, 5), 16);
                const b = parseInt(blob.color.slice(5, 7), 16);

                gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${blob.opacity})`);
                gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${blob.opacity * 0.5})`);
                gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2);
                ctx.fill();
            });

            animationFrameId = requestAnimationFrame(render);
        };

        // Intersection Observer for visibility-based pausing
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    isVisible = true;
                    cancelAnimationFrame(animationFrameId);
                    animationFrameId = requestAnimationFrame(render);
                } else {
                    isVisible = false;
                    cancelAnimationFrame(animationFrameId);
                }
            });
        }, { threshold: 0 });

        observer.observe(canvas);

        window.addEventListener('resize', init);
        init();

        // Start animation immediately (observer will take over visibility control)
        animationFrameId = requestAnimationFrame(render);

        return () => {
            window.removeEventListener('resize', init);
            cancelAnimationFrame(animationFrameId);
            observer.disconnect();
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 -z-10 w-full h-full"
            style={{
                filter: 'blur(60px)',
                opacity: 0.8
            }}
        />
    );
};
