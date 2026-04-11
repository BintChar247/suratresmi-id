import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  selected?: boolean;
}

export function Card({
  children,
  className = '',
  onClick,
  selected = false,
}: CardProps): JSX.Element {
  const baseClasses =
    'rounded-lg border-2 p-4 transition-all bg-white';
  const interactiveClasses = onClick
    ? 'cursor-pointer hover:border-primary-400 hover:bg-primary-50 hover:shadow-sm active:scale-95'
    : '';
  const selectedClasses = selected
    ? 'border-primary-500 bg-primary-50 shadow-sm'
    : 'border-gray-200';

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${baseClasses} ${interactiveClasses} ${selectedClasses} text-left w-full ${className}`}
      >
        {children}
      </button>
    );
  }

  return (
    <div className={`${baseClasses} ${selectedClasses} ${className}`}>
      {children}
    </div>
  );
}
