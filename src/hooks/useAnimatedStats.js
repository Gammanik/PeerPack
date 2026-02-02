import { useState, useEffect, useRef } from 'react';

export const useAnimatedStats = (targetStats, duration = 800) => {
  const startTimeRef = useRef(null);
  const animationRef = useRef(null);

  const [animatedStats, setAnimatedStats] = useState(() => {
    // Start with small values instead of 0 to avoid showing zeros
    const initialStats = {};
    Object.keys(targetStats).forEach(key => {
      if (typeof targetStats[key] === 'number') {
        if (targetStats[key] % 1 !== 0) {
          // For decimal numbers, properly round to 1 decimal place
          const value = Math.max(0.1, targetStats[key] * 0.05);
          initialStats[key] = parseFloat(value.toFixed(1));
        } else {
          // For integers
          initialStats[key] = Math.max(1, Math.round(targetStats[key] * 0.05)); // Start at 5%, minimum 1
        }
      } else {
        initialStats[key] = targetStats[key];
      }
    });
    return initialStats;
  });

  useEffect(() => {
    startTimeRef.current = Date.now();
    const startProgress = 0.05; // Start from 5% instead of 0

    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const rawProgress = Math.min(elapsed / duration, 1);

      if (rawProgress >= 1) {
        // Animation complete - set final values exactly
        setAnimatedStats(targetStats);
        return;
      }

      // Map progress from [0, 1] to [startProgress, 1]
      const progress = startProgress + (1 - startProgress) * rawProgress;

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);

      const newStats = {};
      Object.keys(targetStats).forEach(key => {
        if (typeof targetStats[key] === 'number') {
          if (targetStats[key] % 1 !== 0) {
            // For decimal numbers, properly round to 1 decimal place
            const value = targetStats[key] * easeOutQuart;
            newStats[key] = parseFloat(value.toFixed(1));
          } else {
            // For integers
            newStats[key] = Math.round(targetStats[key] * easeOutQuart);
          }
        } else {
          newStats[key] = targetStats[key];
        }
      });

      setAnimatedStats(newStats);
      animationRef.current = requestAnimationFrame(animate);
    };

    // Start animation on next frame to avoid blocking initial render
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [targetStats, duration]);

  return animatedStats;
};