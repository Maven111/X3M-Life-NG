import React from 'react';

export interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'light';
  className?: string;
}

/**
 * Official X3M Ideas Brand Logo Component
 * - variant="default": Assets/Brand/X3M-Logo.png (for light M3 surfaces)
 * - variant="light": public/images/x3m-logo-light.png (white/silver wordmark for dark cinematic surfaces)
 * Preserves original aspect ratio strictly (object-contain, height-constrained only).
 */
export function BrandLogo({ size = 'md', variant = 'default', className = '' }: BrandLogoProps) {
  const heightClass =
    size === 'sm' ? 'h-8' :
    size === 'lg' ? 'h-16' :
    'h-10';

  const src =
    variant === 'light'
      ? '/images/x3m-logo-light.png'
      : '/api/assets/Brand/X3M-Logo.png';

  return (
    <img
      src={src}
      alt="X3M Ideas"
      className={`${heightClass} w-auto object-contain select-none ${className}`}
      draggable={false}
    />
  );
}
