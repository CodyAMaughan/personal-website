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
        const gridSize = 40;
        const perspective = 300;

        const init = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        const drawGrid = (t: number) => {
            ctx.fillStyle = '#0a0a0a'; // Dark background
            ctx.fillRect(0, 0, width, height);

            ctx.lineWidth = 1;

            // Create a moving horizon effect
            const centerY = height / 2;
            const centerX = width / 2;

            // Vertical lines (perspective)
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
            for (let x = -width; x < width * 2; x += gridSize * 2) {
                ctx.beginPath();
                ctx.moveTo(x - (t * 20) % (gridSize * 2), height);
                ctx.lineTo(centerX + (x - centerX - (t * 20) % (gridSize * 2)) * 0.1, centerY - 100);
                ctx.stroke();
            }

            // Horizontal lines (moving down)
            for (let y = 0; y < height / 2; y += gridSize / 2) {
                const depth = y / (height / 2); // 0 to 1
                const layoutY = height - (Math.pow(depth, 2) * (height / 2));
                const offset = (t * 50) % (gridSize / 2);

                const finalY = layoutY + offset;

                if (finalY > height) continue;

                ctx.globalAlpha = Math.max(0, 1 - depth); // Fade out towards horizon
                ctx.beginPath();
                ctx.moveTo(0, finalY);
                ctx.lineTo(width, finalY);
                ctx.stroke();
                ctx.globalAlpha = 1;
            }
        };

        const render = () => {
            time += 0.005;
            drawGrid(time);
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
            className="absolute inset-0 -z-10 w-full h-full opacity-50"
        />
    );
};
