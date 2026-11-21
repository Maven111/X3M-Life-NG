import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'accent' | 'deadline' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

/**
 * Material Design 3 Badge Component for X3M Ideas
 * Used for level indicators, deadline alerts, currency badges, and status labels.
 * Pure semantic tokens. Zero hard-coded hex colors.
 */
export function Badge({
  children,
  variant = 'default',
  size = 'md',
  icon,
  className = '',
  ...props
}: BadgeProps) {
  const sizeClasses: Record<string, string> = {
    sm: 'px-2 py-0.5 text-[10px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
    lg: 'px-3.5 py-1.5 text-sm gap-2'
  };

  const variantClasses: Record<string, string> = {
    default: 'bg-surface-container text-surface-foreground border border-outline-variant',
    primary: 'bg-primary text-primary-foreground font-semibold',
    secondary: 'bg-secondary text-secondary-foreground font-medium',
    accent: 'bg-tertiary text-tertiary-foreground font-bold shadow-elevation-1',
    deadline: 'bg-error text-error-foreground font-semibold',
    success: 'bg-success-container text-success-container-foreground border border-success/30 font-medium',
    warning: 'bg-warning-container text-warning-container-foreground border border-warning/30 font-medium',
    error: 'bg-error-container text-error-container-foreground border border-error/30 font-medium',
    info: 'bg-info-container text-info-container-foreground border border-info/30 font-medium'
  };

  return (
    <span
      className={`
        inline-flex items-center justify-center font-body rounded-m3-full
        ${sizeClasses[size] || sizeClasses.md}
        ${variantClasses[variant] || variantClasses.default}
        ${className}
      `}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );
}

