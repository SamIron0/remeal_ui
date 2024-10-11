'use client';
import React, { useState, useEffect } from 'react';

const stats = [
  { label: 'Recipes', value: 100, suffix: '+' },
  { label: 'Active Users', value: 50, suffix: '+' },
  { label: 'Ingredients', value: 500, suffix: '+' },
];

const AnimatedStats: React.FC = () => {
  const [counts, setCounts] = useState(stats.map(() => 0));

  useEffect(() => {
    const duration = 2000; // Animation duration in milliseconds
    const frameDuration = 1000 / 60; // 60 fps
    const totalFrames = Math.round(duration / frameDuration);

    const counters = stats.map((stat, index) => {
      let frame = 0;
      const countTo = stat.value;

      return setInterval(() => {
        frame++;
        const progress = frame / totalFrames;
        const currentCount = Math.round(countTo * progress);

        setCounts(prevCounts => {
          const newCounts = [...prevCounts];
          newCounts[index] = currentCount;
          return newCounts;
        });

        if (frame === totalFrames) {
          clearInterval(counters[index]);
        }
      }, frameDuration);
    });

    return () => counters.forEach(counter => clearInterval(counter));
  }, []);

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="space-y-2">
              <h3 className="text-4xl font-bold">
                {counts[index].toLocaleString()}{stat.suffix}
              </h3>
              <p className="text-xl">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AnimatedStats;
