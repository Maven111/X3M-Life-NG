/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // Brand Base
        brand: {
          orange: 'rgb(var(--brand-orange-rgb) / <alpha-value>)',
          red: 'rgb(var(--brand-red-rgb) / <alpha-value>)',
          yellow: 'rgb(var(--brand-yellow-rgb) / <alpha-value>)',
          charcoal: 'rgb(var(--brand-charcoal-rgb) / <alpha-value>)',
          lightGrey: 'rgb(var(--brand-light-grey-rgb) / <alpha-value>)',
          white: 'rgb(var(--brand-white-rgb) / <alpha-value>)'
        },
        // M3 Semantic System Colors
        primary: {
          DEFAULT: 'rgb(var(--md-sys-color-primary) / <alpha-value>)',
          foreground: 'rgb(var(--md-sys-color-on-primary) / <alpha-value>)',
          container: 'rgb(var(--md-sys-color-primary-container) / <alpha-value>)',
          'container-foreground': 'rgb(var(--md-sys-color-on-primary-container) / <alpha-value>)'
        },
        secondary: {
          DEFAULT: 'rgb(var(--md-sys-color-secondary) / <alpha-value>)',
          foreground: 'rgb(var(--md-sys-color-on-secondary) / <alpha-value>)',
          container: 'rgb(var(--md-sys-color-secondary-container) / <alpha-value>)',
          'container-foreground': 'rgb(var(--md-sys-color-on-secondary-container) / <alpha-value>)'
        },
        tertiary: {
          DEFAULT: 'rgb(var(--md-sys-color-tertiary) / <alpha-value>)',
          foreground: 'rgb(var(--md-sys-color-on-tertiary) / <alpha-value>)',
          container: 'rgb(var(--md-sys-color-tertiary-container) / <alpha-value>)',
          'container-foreground': 'rgb(var(--md-sys-color-on-tertiary-container) / <alpha-value>)'
        },
        surface: {
          DEFAULT: 'rgb(var(--md-sys-color-surface) / <alpha-value>)',
          dim: 'rgb(var(--md-sys-color-surface-dim) / <alpha-value>)',
          bright: 'rgb(var(--md-sys-color-surface-bright) / <alpha-value>)',
          'container-lowest': 'rgb(var(--md-sys-color-surface-container-lowest) / <alpha-value>)',
          'container-low': 'rgb(var(--md-sys-color-surface-container-low) / <alpha-value>)',
          container: 'rgb(var(--md-sys-color-surface-container) / <alpha-value>)',
          'container-high': 'rgb(var(--md-sys-color-surface-container-high) / <alpha-value>)',
          'container-highest': 'rgb(var(--md-sys-color-surface-container-highest) / <alpha-value>)',
          foreground: 'rgb(var(--md-sys-color-on-surface) / <alpha-value>)',
          'variant-foreground': 'rgb(var(--md-sys-color-on-surface-variant) / <alpha-value>)',
          'muted-foreground': 'rgb(var(--md-sys-color-on-surface-muted) / <alpha-value>)'
        },
        outline: {
          DEFAULT: 'rgb(var(--md-sys-color-outline) / <alpha-value>)',
          variant: 'rgb(var(--md-sys-color-outline-variant) / <alpha-value>)'
        },
        error: {
          DEFAULT: 'rgb(var(--md-sys-color-error) / <alpha-value>)',
          foreground: 'rgb(var(--md-sys-color-on-error) / <alpha-value>)',
          container: 'rgb(var(--md-sys-color-error-container) / <alpha-value>)',
          'container-foreground': 'rgb(var(--md-sys-color-on-error-container) / <alpha-value>)'
        },
        success: {
          DEFAULT: 'rgb(var(--md-sys-color-success) / <alpha-value>)',
          foreground: 'rgb(var(--md-sys-color-on-success) / <alpha-value>)',
          container: 'rgb(var(--md-sys-color-success-container) / <alpha-value>)',
          'container-foreground': 'rgb(var(--md-sys-color-on-success-container) / <alpha-value>)'
        },
        warning: {
          DEFAULT: 'rgb(var(--md-sys-color-warning) / <alpha-value>)',
          foreground: 'rgb(var(--md-sys-color-on-warning) / <alpha-value>)',
          container: 'rgb(var(--md-sys-color-warning-container) / <alpha-value>)',
          'container-foreground': 'rgb(var(--md-sys-color-on-warning-container) / <alpha-value>)'
        },
        info: {
          DEFAULT: 'rgb(var(--md-sys-color-info) / <alpha-value>)',
          foreground: 'rgb(var(--md-sys-color-on-info) / <alpha-value>)',
          container: 'rgb(var(--md-sys-color-info-container) / <alpha-value>)',
          'container-foreground': 'rgb(var(--md-sys-color-on-info-container) / <alpha-value>)'
        }
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)']
      },
      borderRadius: {
        'm3-xs': 'var(--shape-corner-xs)',
        'm3-sm': 'var(--shape-corner-sm)',
        'm3-md': 'var(--shape-corner-md)',
        'm3-lg': 'var(--shape-corner-lg)',
        'm3-xl': 'var(--shape-corner-xl)',
        'm3-full': 'var(--shape-corner-full)'
      },
      boxShadow: {
        'elevation-0': 'var(--elevation-0)',
        'elevation-1': 'var(--elevation-1)',
        'elevation-2': 'var(--elevation-2)',
        'elevation-3': 'var(--elevation-3)',
        'elevation-4': 'var(--elevation-4)',
        'elevation-5': 'var(--elevation-5)'
      },
      backgroundImage: {
        'brand-gradient-primary': 'var(--brand-gradient-primary)',
        'brand-gradient-hover': 'var(--brand-gradient-primary-hover)',
        'brand-gradient-accent': 'var(--brand-gradient-accent)'
      }
    }
  },
  plugins: []
};

