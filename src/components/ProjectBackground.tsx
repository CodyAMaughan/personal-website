import React, { useEffect, useRef } from 'react';

export const ProjectBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width: number;
        let height: number;
        let animationFrameId: number;
        let time = 0;

        // Grid Configuration
        const gridSize = 60;

        // Pulse Configuration
        interface Pulse {
            x: number;
            y: number;
            direction: 'x' | 'y';
            speed: number;
            color: string;
            length: number;
            life: number;
        }

        const pulses: Pulse[] = [];
        const pulseColors = ['#4ade80', '#3b82f6', '#f59e0b', '#D62566']; // Green, Blue, Amber, Pink

        const init = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        const createPulse = () => {
            if (Math.random() > 0.05) return; // Rare creation

            // Snap to grid
            const isHorizontal = Math.random() > 0.5;
            const x = Math.floor(Math.random() * (width / gridSize)) * gridSize;
            const y = Math.floor(Math.random() * (height / gridSize)) * gridSize;
            const color = pulseColors[Math.floor(Math.random() * pulseColors.length)];

            pulses.push({
                x,
                y,
                direction: isHorizontal ? 'x' : 'y',
                speed: 4 + Math.random() * 4, // Faster speed
                color,
                length: 50 + Math.random() * 100,
                life: 1.0
            });
        };

        const drawGrid = () => {
            // Dark Background
            ctx.fillStyle = '#0a0a0a';
            ctx.fillRect(0, 0, width, height);

            ctx.lineWidth = 1;

            // Draw Static Grid
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'; // Increased visibility

            // Vertical 
            for (let x = 0; x <= width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }

            // Horizontal
            for (let y = 0; y <= height; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }
        };

        const drawPulses = () => {
            // Update and Draw Pulses
            for (let i = pulses.length - 1; i >= 0; i--) {
                const p = pulses[i];

                // Move
                if (p.direction === 'x') p.x += p.speed;
                else p.y += p.speed;

                // Decay
                p.life -= 0.005;

                // Draw
                const gradient = ctx.createLinearGradient(
                    p.direction === 'x' ? p.x - p.length : p.x,
                    p.direction === 'y' ? p.y - p.length : p.y,
                    p.direction === 'x' ? p.x : p.x,
                    p.direction === 'y' ? p.y : p.y
                );

                // Tail fade
                gradient.addColorStop(0, 'transparent');
                gradient.addColorStop(1, p.color);

                ctx.strokeStyle = gradient;
                ctx.lineWidth = 2;
                ctx.globalAlpha = p.life;
                ctx.shadowBlur = 10;
                ctx.shadowColor = p.color;

                ctx.beginPath();
                if (p.direction === 'x') {
                    ctx.moveTo(p.x - p.length, p.y);
                    ctx.lineTo(p.x, p.y);
                } else {
                    ctx.moveTo(p.x, p.y - p.length);
                    ctx.lineTo(p.x, p.y);
                }
                ctx.stroke();

                ctx.shadowBlur = 0;
                ctx.globalAlpha = 1;

                // Remove if dead or off screen
                if (p.life <= 0 || p.x > width + p.length || p.y > height + p.length) {
                    pulses.splice(i, 1);
                }
            }
        };

        const render = () => {
            time += 0.01;
            drawGrid();
            createPulse();
            drawPulses();
            animationFrameId = requestAnimationFrame(render);
        };

        window.addEventListener('resize', init);
        init();
        render();

        return () => {
            window.removeEventListener('resize', init);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 -z-10 w-full h-full opacity-60"
        />
    );
};
