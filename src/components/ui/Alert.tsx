import React from 'react';

export interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  variant?: 'success' | 'warning' | 'error' | 'info';
  title?: React.ReactNode;
  icon?: React.ReactNode;
  onClose?: () => void;
}

/**
 * Material Design 3 Alert / Feedback Banner Component for X3M Ideas
 * Matches the official "Action Successful!" and "Please try again." patterns from Brand Guidelines v1.0.
 * Pure semantic tokens. Zero hard-coded hex colors.
 */
export function Alert({
  children,
  variant = 'info',
  title,
  icon,
  onClose,
  className = '',
  ...props
}: AlertProps) {
  const variantStyles = {
    success: {
      container: 'bg-success-container text-success-container-foreground border-success/30',
      iconColor: 'text-success',
      defaultIcon: '✓'
    },
    warning: {
      container: 'bg-warning-container text-warning-container-foreground border-warning/30',
      iconColor: 'text-warning',
      defaultIcon: '!'
    },
    error: {
      container: 'bg-error-container text-error-container-foreground border-error/30',
      iconColor: 'text-error',
      defaultIcon: '✕'
    },
    info: {
      container: 'bg-info-container text-info-container-foreground border-info/30',
      iconColor: 'text-info',
      defaultIcon: 'ℹ'
    }
  };

  const current = variantStyles[variant] || variantStyles.info;

  return (
    <div
      role="alert"
      className={`
        flex items-center justify-between p-3.5 rounded-m3-md border
        shadow-elevation-1 transition-all duration-200
        ${current.container}
        ${className}
      `}
      {...props}
    >
      <div className="flex items-center gap-3">
        <div className={`
          flex-shrink-0 w-6 h-6 rounded-m3-full flex items-center justify-center font-bold text-xs
          ${current.iconColor} bg-white/60 dark:bg-black/20
        `}>
          {icon || current.defaultIcon}
        </div>
        <div className="text-sm font-body">
          {title && <div className="font-semibold text-xs tracking-wide uppercase opacity-90">{title}</div>}
          <div className="leading-relaxed">{children}</div>
        </div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          aria-label="Close alert"
          className="ml-3 p-1 rounded-m3-full hover:bg-black/10 dark:hover:bg-white/10 text-xs transition-colors"
        >
          ✕
        </button>
      )}
    </div>
  );
}
