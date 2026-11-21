/**
 * Google Material Design 3 (M3) Design Token Mapping for X3M Ideas
 * Incorporates M3 Semantic Roles (Primary, Secondary, Tertiary, Surface, Error, Success, Warning)
 * Supports both Light and Dark themes dynamically.
 */

export const m3Typography = {
  display: {
    fontFamily: "'Montserrat', sans-serif",
    large: { fontSize: '3.5625rem', lineHeight: '4rem', fontWeight: 700, letterSpacing: '-0.015em' }, // 57px
    medium: { fontSize: '2.8125rem', lineHeight: '3.25rem', fontWeight: 700, letterSpacing: '0' },   // 45px
    small: { fontSize: '2.25rem', lineHeight: '2.75rem', fontWeight: 600, letterSpacing: '0' }       // 36px
  },
  headline: {
    fontFamily: "'Montserrat', sans-serif",
    large: { fontSize: '2rem', lineHeight: '2.5rem', fontWeight: 700, letterSpacing: '0' },          // 32px
    medium: { fontSize: '1.75rem', lineHeight: '2.25rem', fontWeight: 600, letterSpacing: '0' },     // 28px
    small: { fontSize: '1.5rem', lineHeight: '2rem', fontWeight: 600, letterSpacing: '0' }          // 24px
  },
  title: {
    fontFamily: "'Montserrat', sans-serif",
    large: { fontSize: '1.375rem', lineHeight: '1.75rem', fontWeight: 600, letterSpacing: '0' },     // 22px
    medium: { fontSize: '1rem', lineHeight: '1.5rem', fontWeight: 600, letterSpacing: '0.009em' },   // 16px
    small: { fontSize: '0.875rem', lineHeight: '1.25rem', fontWeight: 500, letterSpacing: '0.007em' } // 14px
  },
  body: {
    fontFamily: "'Inter', sans-serif",
    large: { fontSize: '1rem', lineHeight: '1.5rem', fontWeight: 400, letterSpacing: '0.03em' },       // 16px
    medium: { fontSize: '0.875rem', lineHeight: '1.25rem', fontWeight: 400, letterSpacing: '0.017em' }, // 14px
    small: { fontSize: '0.75rem', lineHeight: '1rem', fontWeight: 400, letterSpacing: '0.033em' }      // 12px
  },
  label: {
    fontFamily: "'Inter', sans-serif",
    large: { fontSize: '0.875rem', lineHeight: '1.25rem', fontWeight: 500, letterSpacing: '0.007em' }, // 14px
    medium: { fontSize: '0.75rem', lineHeight: '1rem', fontWeight: 500, letterSpacing: '0.033em' },    // 12px
    small: { fontSize: '0.6875rem', lineHeight: '1rem', fontWeight: 500, letterSpacing: '0.033em' }    // 11px
  }
};

export const m3Elevation = {
  level0: 'none',
  level1: '0px 1px 3px 1px rgba(0, 0, 0, 0.12), 0px 1px 2px 0px rgba(0, 0, 0, 0.20)',
  level2: '0px 2px 6px 2px rgba(0, 0, 0, 0.12), 0px 1px 2px 0px rgba(0, 0, 0, 0.20)',
  level3: '0px 4px 8px 3px rgba(0, 0, 0, 0.12), 0px 1px 3px 0px rgba(0, 0, 0, 0.20)',
  level4: '0px 6px 10px 4px rgba(0, 0, 0, 0.12), 0px 2px 3px 0px rgba(0, 0, 0, 0.20)',
  level5: '0px 8px 12px 6px rgba(0, 0, 0, 0.12), 0px 4px 4px 0px rgba(0, 0, 0, 0.20)'
};

export const m3Shape = {
  none: '0px',
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '28px',
  full: '9999px' // Standard M3 pill shape for buttons and badges
};

export const m3Spacing = {
  0: '0px',
  1: '4px',   // 0.25rem
  2: '8px',   // 0.5rem
  3: '12px',  // 0.75rem
  4: '16px',  // 1rem
  5: '20px',  // 1.25rem
  6: '24px',  // 1.5rem
  8: '32px',  // 2rem
  10: '40px', // 2.5rem
  12: '48px', // 3rem
  16: '64px', // 4rem
  20: '80px', // 5rem
  24: '96px'  // 6rem
};

export const m3StateLayers = {
  hoverOpacity: 0.08,
  focusOpacity: 0.12,
  pressedOpacity: 0.16,
  draggedOpacity: 0.20,
  disabledOpacity: 0.38
};

