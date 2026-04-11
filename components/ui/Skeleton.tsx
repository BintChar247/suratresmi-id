import React from 'react';

export function SkeletonInput(): JSX.Element {
  return <div className="h-12 bg-gray-200 rounded-lg animate-pulse" />;
}

export function SkeletonCard(): JSX.Element {
  return <div className="h-20 bg-gray-200 rounded-lg animate-pulse" />;
}

export function SkeletonText({ lines = 3 }: { lines?: number }): JSX.Element {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-gray-200 rounded animate-pulse"
          style={{ width: i === lines - 1 ? '60%' : '100%' }}
        />
      ))}
    </div>
  );
}
