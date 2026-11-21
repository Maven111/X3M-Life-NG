import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary-gradient' | 'primary' | 'secondary' | 'tonal' | 'text' | 'error';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

/**
 * Material Design 3 Button Component for X3M Ideas
 * Strictly references semantic tokens and M3 shapes. Zero hard-coded hex colors.
 */
export function Button({
  children,
  variant = 'primary-gradient',
  size = 'md',
  disabled = false,
  onClick,
  className = '',
  icon,
  ...props
}: ButtonProps) {
  const sizeClasses: Record<string, string> = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5'
  };

  const variantClasses: Record<string, string> = {
    // Official X3M Signature Gradient Pill
    'primary-gradient': `
      bg-brand-gradient-primary hover:bg-brand-gradient-hover active:opacity-90
      text-white font-semibold shadow-elevation-1 hover:shadow-elevation-2 active:shadow-elevation-1
      border-0
    `,
    // M3 Filled Primary
    primary: `
      bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80
      font-semibold shadow-elevation-1 hover:shadow-elevation-2
    `,
    // M3 Outlined / Secondary Button
    secondary: `
      bg-surface text-surface-foreground hover:bg-surface-container active:bg-surface-container-high
      border border-outline font-medium shadow-elevation-0
    `,
    // M3 Tonal Container
    tonal: `
      bg-primary-container text-primary-container-foreground hover:bg-primary-container/80
      font-medium border-0
    `,
    // M3 Text Button
    text: `
      bg-transparent text-primary hover:bg-primary/10 active:bg-primary/20
      font-medium border-0
    `,
    // Error / Destructive
    error: `
      bg-error text-error-foreground hover:bg-error/90 active:bg-error/80
      font-medium shadow-elevation-1
    `
  };

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`
        inline-flex items-center justify-center
        rounded-m3-full font-body transition-all duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
        disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none
        ${sizeClasses[size] || sizeClasses.md}
        ${variantClasses[variant] || variantClasses['primary-gradient']}
        ${className}
      `}
      {...props}
    >
      {children}
      {icon && <span className="flex-shrink-0">{icon}</span>}
    </button>
  );
}

