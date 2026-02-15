import React from 'react';

const LoadingSkeleton: React.FC<{ rows?: number }> = ({ rows = 3 }) => (
  <div className="space-y-4 animate-fade-in">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="shimmer h-16 rounded-xl" style={{ animationDelay: `${i * 0.1}s` }} />
    ))}
  </div>
);

export default LoadingSkeleton;
