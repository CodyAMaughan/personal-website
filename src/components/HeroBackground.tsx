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

        // Configuration
        const beams: Beam[] = [];
        const beamCount = 4;
        const damping = 0.05;

        class Beam {
            color: string;
            x!: number;
            width!: number;
            speed!: number;
            offset!: number;
            opacity!: number;

            constructor(index: number) {
                // Distribute colors
                if (index % 3 === 0) this.color = THEME_COLORS.primary;
                else if (index % 3 === 1) this.color = THEME_COLORS.secondary;
                else this.color = THEME_COLORS.accent;

                this.init(index);
            }

            init(index: number) {
                this.x = Math.random() * width;
                this.width = width * 0.4 + Math.random() * (width * 0.3); // Wide beams
                this.speed = 0.2 + Math.random() * 0.3; // Slow drift
                this.offset = Math.random() * 1000;
                this.opacity = 0.2 + Math.random() * 0.2; // Slightly higher opacity (0.2 to 0.4)
            }

            draw(ctx: CanvasRenderingContext2D, time: number) {
                // Interactive movement
                // Mouse X affects speed slightly, Mouse Y affects width/intensity?
                // Let's make them drift and curve like aurora

                const t = time * 0.001;

                // Movement
                // Base drift
                let currentX = this.x + Math.sin(t * 0.5 + this.offset) * 100;

                // Mouse Interaction (Attraction/Distortion)
                const dx = mouseX - (width / 2);
                const dy = mouseY - (height / 2); // Center relative

                // Parallax-ish feel
                currentX += dx * 0.05 * (this.speed * 2);

                // Create Gradient
                // Vertical gradient representing a beam of light shooting up/down
                const gradient = ctx.createLinearGradient(currentX, 0, currentX + Math.sin(t + this.offset) * 200, height);

                // Aurora colors usually fade in and out
                // Top (transparent) -> Color -> Bottom (transparent) or similar
                // Let's try: Top (Color 0) -> Middle (Color 0.5) -> Bottom (Color 0)

                // Hex to RGB for opacity handling?
                // Or just use globalAlpha

                ctx.globalAlpha = this.opacity;
                // Composite for "light" effect
                ctx.globalCompositeOperation = 'lighter'; // or 'screen'

                gradient.addColorStop(0, 'transparent');
                gradient.addColorStop(0.2, this.color); // Fade in
                gradient.addColorStop(0.5, this.color); // Body
                gradient.addColorStop(0.8, this.color); // Fade out
                gradient.addColorStop(1, 'transparent');

                ctx.fillStyle = gradient;

                // Shape: Curved customized rect
                ctx.beginPath();

                // Draw a flowing shape
                const points = [];
                const segments = 10;
                const segmentHeight = height / segments;

                points.push({ x: currentX, y: 0 }); // Start top

                for (let i = 0; i <= segments; i++) {
                    const y = i * segmentHeight;
                    // Sine wave distortion for "curtain" look
                    const waveX = Math.sin(y * 0.002 + t + this.offset) * (width * 0.1); // Waving
                    const mouseAffect = (1 - Math.abs(y - mouseY) / height) * (dx * 0.2); // Mouse pulls parts of it?

                    points.push({ x: currentX + waveX + mouseAffect, y: y });
                }

                // Draw left side
                ctx.moveTo(points[0].x - this.width / 2, points[0].y);
                for (let i = 1; i < points.length; i++) {
                    const p = points[i];
                    // Smooth curve? Lineto for now
                    ctx.lineTo(p.x - this.width / 2, p.y);
                }

                // Bottom
                // ctx.lineTo(points[points.length-1].x + this.width/2, height);

                // Draw right side (trace back up)
                for (let i = points.length - 1; i >= 0; i--) {
                    const p = points[i];
                    ctx.lineTo(p.x + this.width / 2, p.y);
                }

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

            // Clear
            ctx.fillStyle = THEME_COLORS.background;
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

