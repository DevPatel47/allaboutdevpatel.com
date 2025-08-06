import React, { useEffect, useRef } from 'react';

/**
 * AnimatedBlurDots Component
 * Renders a given number of blurred dots that move randomly within the parent container,
 * never stopping and always staying inside the left and right boundaries.
 * @param {Object} props
 * @param {number} props.count - Number of dots to render.
 * @param {string[]} [props.colors] - Optional array of tailwind color classes for dots.
 * @param {string} [props.className] - Optional extra classes for the wrapper.
 */
function AnimatedBlurDots({ count = 5, colors = [], className = '' }) {
    const dotsRef = useRef([]);
    const sizesRef = useRef([]);
    const initialPositionsRef = useRef([]);

    // Generate random sizes and initial positions for each dot on mount
    if (sizesRef.current.length !== count || initialPositionsRef.current.length !== count) {
        sizesRef.current = Array.from({ length: count }).map(
            () => 32 + Math.random() * 96, // 32px to 128px
        );
        initialPositionsRef.current = Array.from({ length: count }).map(() => ({
            x: Math.random(),
            y: Math.random(),
        }));
    }

    useEffect(() => {
        const moveDot = (dot, idx) => {
            if (!dot) return;
            const parent = dot.parentElement;
            if (!parent) return;
            const parentRect = parent.getBoundingClientRect();
            const dotSize = sizesRef.current[idx];
            const maxX = parentRect.width - dotSize;
            const maxY = parentRect.height - dotSize;

            // Random position, always inside left/right/top/bottom
            const x = Math.random() * maxX;
            const y = Math.random() * maxY;

            // Random duration
            const duration = 3 + Math.random() * 3; // 3-6s
            dot.style.transition = `transform ${duration}s cubic-bezier(.4,0,.2,1)`;
            dot.style.transform = `translate(${x}px, ${y}px)`;

            // Schedule next move
            dot._moveTimeout = setTimeout(() => moveDot(dot, idx), duration * 1000);
        };

        // Initial placement and start animation for each dot
        dotsRef.current.forEach((dot, idx) => {
            const parent = dot?.parentElement;
            if (parent) {
                const parentRect = parent.getBoundingClientRect();
                const dotSize = sizesRef.current[idx];
                const maxX = parentRect.width - dotSize;
                const maxY = parentRect.height - dotSize;
                const { x, y } = initialPositionsRef.current[idx];
                const startX = x * maxX;
                const startY = y * maxY;
                dot.style.transform = `translate(${startX}px, ${startY}px)`;
            }
            moveDot(dot, idx);
        });

        // Cleanup on unmount
        return () => {
            dotsRef.current.forEach((dot) => {
                if (dot && dot._moveTimeout) clearTimeout(dot._moveTimeout);
            });
        };
    }, [count]);

    // Default color palette if not provided
    const defaultColors = [
        'bg-blue-300/60 dark:bg-blue-900/40',
        'bg-fuchsia-300/60 dark:bg-fuchsia-900/40',
        'bg-zinc-400/50 dark:bg-zinc-800/60',
        'bg-green-300/60 dark:bg-green-900/40',
        'bg-yellow-300/60 dark:bg-yellow-900/40',
    ];

    return (
        <div className={`absolute inset-0 pointer-events-none ${className}`}>
            {Array.from({ length: count }).map((_, i) => {
                // Use parent size for initial placement
                const parentWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
                const parentHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;
                const dotSize = sizesRef.current[i];
                const maxX = parentWidth - dotSize;
                const maxY = parentHeight - dotSize;
                const { x, y } = initialPositionsRef.current[i];
                const startX = x * maxX;
                const startY = y * maxY;
                return (
                    <div
                        key={i}
                        ref={(el) => (dotsRef.current[i] = el)}
                        className={`
                            absolute rounded-full blur-lg z-20
                            transition-transform
                            ${colors[i % colors.length] || defaultColors[i % defaultColors.length]}
                        `}
                        style={{
                            opacity: 0.55, // Make them more visible on white
                            width: `${dotSize}px`,
                            height: `${dotSize}px`,
                            left: 0,
                            top: 0,
                            transform: `translate(${startX}px, ${startY}px)`,
                        }}
                    />
                );
            })}
        </div>
    );
}

export default AnimatedBlurDots;
