import React, { useEffect, useRef, useState } from 'react';

// Hardcoded from theme.ts to ensure canvas performance without deep imports/deps
// colors:
//   terminalGreen: '#4ade80',
//   electricBlue: '#3b82f6',
//   amber: '#f59e0b',
//   carbon: '#0a0a0a'

const THEME_COLORS = {
    primary: '#4ade80',    // Green
    secondary: '#3b82f6',  // Blue
    accent: '#f59e0b',     // Amber
    background: '#0a0a0a'  // Carbon
};

export const HeroBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        console.log('[HeroBackground] Component MOUNTED / useEffect running');
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        // Use parent container dimensions instead of full window
        const parent = canvas.parentElement;
        let width = parent?.clientWidth || window.innerWidth;
        let height = parent?.clientHeight || window.innerHeight;
        let mouseX = 0;
        let mouseY = 0;
        let targetMouseX = 0;
        let targetMouseY = 0;

        // Configuration - 6 beams for fuller color coverage (2 of each color)
        const beams: Beam[] = [];
        const beamCount = 6;
        const damping = 0.05;

        class Beam {
            color: string;
            x!: number;
            width!: number;
            speed!: number;
            offset!: number;
            opacity!: number;

            constructor(index: number) {
                // Explicitly assign colors to guarantee all three
                const colors = [THEME_COLORS.primary, THEME_COLORS.secondary, THEME_COLORS.accent];
                this.color = colors[index % colors.length];

                this.init(index);
            }

            init(index: number) {
                this.x = Math.random() * width;
                this.width = width * 0.5 + Math.random() * (width * 0.4); // Wider beams for more coverage
                this.speed = 0.2 + Math.random() * 0.3; // Slow drift
                this.offset = Math.random() * 1000;
                this.opacity = 0.25 + Math.random() * 0.25; // Higher opacity (0.25 to 0.5)
            }

            draw(ctx: CanvasRenderingContext2D, time: number) {
                const t = time * 0.001;

                // Base drift
                let currentX = this.x + Math.sin(t * 0.5 + this.offset) * 100;

                // Mouse Interaction
                const dx = mouseX - (width / 2);

                // Parallax-ish feel
                currentX += dx * 0.05 * (this.speed * 2);

                // Create Gradient
                const gradient = ctx.createLinearGradient(currentX, 0, currentX + Math.sin(t + this.offset) * 200, height);

                ctx.globalAlpha = this.opacity;
                ctx.globalCompositeOperation = 'lighter';

                gradient.addColorStop(0, 'transparent');
                gradient.addColorStop(0.2, this.color);
                gradient.addColorStop(0.5, this.color);
                gradient.addColorStop(0.8, this.color);
                gradient.addColorStop(1, 'transparent');

                ctx.fillStyle = gradient;

                // Build smooth flowing shape with more segments for smoother curves
                ctx.beginPath();

                const segments = 20; // More segments for smoother curves
                const segmentHeight = height / segments;

                // Calculate all points first
                const leftPoints: { x: number; y: number }[] = [];
                const rightPoints: { x: number; y: number }[] = [];

                for (let i = 0; i <= segments; i++) {
                    const y = i * segmentHeight;
                    const waveX = Math.sin(y * 0.003 + t + this.offset) * (width * 0.08);
                    const mouseAffect = (1 - Math.abs(y - mouseY) / height) * (dx * 0.15);
                    const centerX = currentX + waveX + mouseAffect;

                    leftPoints.push({ x: centerX - this.width / 2, y });
                    rightPoints.push({ x: centerX + this.width / 2, y });
                }

                // Draw left side with smooth quadratic curves
                ctx.moveTo(leftPoints[0].x, leftPoints[0].y);
                for (let i = 1; i < leftPoints.length; i++) {
                    const prev = leftPoints[i - 1];
                    const curr = leftPoints[i];
                    // Use midpoint as control point for smooth curves
                    const cpX = (prev.x + curr.x) / 2;
                    const cpY = (prev.y + curr.y) / 2;
                    ctx.quadraticCurveTo(prev.x, prev.y, cpX, cpY);
                }
                // Final point
                ctx.lineTo(leftPoints[leftPoints.length - 1].x, leftPoints[leftPoints.length - 1].y);

                // Draw right side back up with smooth curves
                for (let i = rightPoints.length - 1; i > 0; i--) {
                    const curr = rightPoints[i];
                    const prev = rightPoints[i - 1];
                    const cpX = (curr.x + prev.x) / 2;
                    const cpY = (curr.y + prev.y) / 2;
                    ctx.quadraticCurveTo(curr.x, curr.y, cpX, cpY);
                }
                ctx.lineTo(rightPoints[0].x, rightPoints[0].y);

                ctx.closePath();
                ctx.fill();

                // Reset composite
                ctx.globalCompositeOperation = 'source-over';
            }
        }

        // Initialize canvas bitmap once on mount (never resize bitmap to avoid flash)
        const initCanvas = () => {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.scale(dpr, dpr);
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            // Fill initial background
            ctx.fillStyle = THEME_COLORS.background;
            ctx.fillRect(0, 0, width, height);
        };

        // Only updates CSS size on resize - bitmap stays fixed (avoids flash)
        const resizeCanvas = () => {
            width = parent?.clientWidth || window.innerWidth;
            height = parent?.clientHeight || window.innerHeight;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
        };

        // Creates beams - only called once on mount
        const initBeams = () => {
            beams.length = 0;
            for (let i = 0; i < beamCount; i++) {
                beams.push(new Beam(i));
            }
        };

        // Debounce resize to reduce jitter
        let resizeTimeout: number;
        const handleResize = () => {
            cancelAnimationFrame(resizeTimeout);
            resizeTimeout = requestAnimationFrame(() => {
                resizeCanvas();
            });
        };

        const handleMouseMove = (e: MouseEvent) => {
            targetMouseX = e.clientX;
            targetMouseY = e.clientY;
        };

        let isVisible = true;

        const render = (time: number) => {
            if (!isVisible) return;

            // Smooth mouse
            mouseX += (targetMouseX - mouseX) * damping;
            mouseY += (targetMouseY - mouseY) * damping;

            // Draw subtle gradient background instead of solid black
            const bgGradient = ctx.createRadialGradient(
                width * 0.5, height * 0.3, 0,
                width * 0.5, height * 0.5, Math.max(width, height)
            );
            bgGradient.addColorStop(0, '#12151a'); // Slightly lighter center
            bgGradient.addColorStop(0.5, '#0d0f12'); // Mid-tone
            bgGradient.addColorStop(1, THEME_COLORS.background); // Dark edges
            ctx.fillStyle = bgGradient;
            ctx.fillRect(0, 0, width, height);

            beams.forEach(beam => beam.draw(ctx, time));

            animationFrameId = requestAnimationFrame(render);
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);

        initCanvas();
        initBeams();

        // Trigger fade-in after first frame
        requestAnimationFrame(() => {
            console.log('[HeroBackground] Setting isLoaded to TRUE');
            setIsLoaded(true);
        });

        // Initial center
        targetMouseX = window.innerWidth / 2;
        targetMouseY = window.innerHeight / 2;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    isVisible = true;
                    cancelAnimationFrame(animationFrameId); // Prevent double loops
                    animationFrameId = requestAnimationFrame(render);
                } else {
                    isVisible = false;
                    cancelAnimationFrame(animationFrameId);
                }
            });
        }, { threshold: 0 });

        observer.observe(canvas);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
            observer.disconnect();
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 -z-10 w-full h-full"
            style={{
                background: THEME_COLORS.background,
                willChange: 'transform',
            }}
        />
    );
};

