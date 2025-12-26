import { useState, useEffect } from 'react';

export const useAnimatedStats = (targetStats, duration = 2000) => {
  const [animatedStats, setAnimatedStats] = useState({});

  useEffect(() => {
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      const newStats = {};
      Object.keys(targetStats).forEach(key => {
        if (typeof targetStats[key] === 'number') {
          if (targetStats[key] % 1 !== 0) {
            // For decimal numbers, keep one decimal place
            newStats[key] = Math.round(targetStats[key] * easeOutQuart * 10) / 10;
          } else {
            // For integers
            newStats[key] = Math.round(targetStats[key] * easeOutQuart);
          }
        } else {
          newStats[key] = targetStats[key];
        }
      });
      
      setAnimatedStats(newStats);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  }, [targetStats, duration]);

  return animatedStats;
};