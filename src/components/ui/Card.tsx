import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'elevated' | 'filled' | 'outlined';
  elevation?: 'elevation-0' | 'elevation-1' | 'elevation-2' | 'elevation-3' | 'elevation-4' | 'elevation-5';
}

/**
 * Material Design 3 Card Component for X3M Ideas
 * Provides semantic surface containers, elevation, and optional interactive states.
 * Pure semantic tokens. Zero hard-coded hex colors.
 */
export function Card({
  children,
  variant = 'elevated',
  elevation = 'elevation-1',
  className = '',
  onClick,
  ...props
}: CardProps) {
  const variantClasses: Record<string, string> = {
    elevated: `bg-surface text-surface-foreground shadow-${elevation} border-0`,
    filled: 'bg-surface-container text-surface-foreground border-0 shadow-elevation-0',
    outlined: 'bg-surface text-surface-foreground border border-outline shadow-elevation-0'
  };

  const interactiveClasses = onClick
    ? 'cursor-pointer hover:shadow-elevation-2 active:shadow-elevation-1 transition-all duration-200'
    : '';

  return (
    <div
      onClick={onClick}
      className={`
        rounded-m3-lg p-5 font-body
        ${variantClasses[variant] || variantClasses.elevated}
        ${interactiveClasses}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

