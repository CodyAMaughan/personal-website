import React, { useEffect, useRef } from 'react';

import { theme } from '../config/theme';

export const MusicBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let width: number;
        let height: number;
        let time = 0;

        const lines = [
            { color: theme.colors.primary, speed: 1, amplitude: 50, yOffset: 0.3 },
            { color: theme.colors.secondary, speed: 1.2, amplitude: 40, yOffset: 0.5 },
            { color: theme.colors.accent, speed: 0.8, amplitude: 60, yOffset: 0.7 },
        ];

        const init = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            // Set canvas size twice the size for retina screens
            canvas.width = width * 2;
            canvas.height = height * 2;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.scale(2, 2);
        };

        const render = () => {
            time += 0.01;
            ctx.clearRect(0, 0, width, height);

            lines.forEach((line, index) => {
                ctx.beginPath();
                ctx.strokeStyle = line.color;
                ctx.lineWidth = 4; // Thicker lines
                ctx.lineCap = 'round';
                ctx.globalAlpha = 0.5;

                // Add Bloom/Glow Effect
                ctx.shadowBlur = 15;
                ctx.shadowColor = line.color;

                for (let x = 0; x < width; x += 5) {
                    const y = height * line.yOffset +
                        Math.sin(x * 0.005 + time * line.speed) * line.amplitude +
                        Math.sin(x * 0.01 + time * 0.5) * (line.amplitude * 0.5); // Add complexity

                    if (x === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                ctx.stroke();
            });

            animationFrameId = requestAnimationFrame(render);
        };

        init();
        render();

        const handleResize = () => {
            init();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 max-w-full"
            style={{ opacity: 0.6 }} // Subtle global opacity
        />
    );
};
