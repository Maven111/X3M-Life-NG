/**
 * Central Source of Truth for Design Tokens
 * Exporting Brand, Google Material Design 3 (M3) Semantic Roles, and 3D Environment Tokens
 */

export * from './brand.js';
export * from './material-theme.js';
export * from './3d-materials.js';

/**
 * Token Registry metadata for developer ergonomics & lint checks
 */
export const tokenMetadata = {
  system: 'Google Material Design 3 (M3) with X3M Ideas Brand Identity',
  version: '1.0.0',
  brandGuidelineVersion: '1.0 (Assets/Brand/brand-guidelines.png)',
  supportedThemes: ['light', 'dark']
};

