/**
 * X3M Ideas - Central Brand Reference Tokens
 * Source of Truth: Assets/Brand/brand-guidelines.png (Brand Guidelines v1.0)
 *
 * NOTE: Only values explicitly present in approved brand guidelines are marked as official.
 * Any supporting tones or missing semantic colors are explicitly marked as PROVISIONAL.
 */

export const brandColors = {
  // Official Approved Palette (Hex & RGB channels for CSS variable composition)
  x3mOrange: {
    hex: '#F59E0B',
    rgb: '245, 158, 11',
    status: 'official',
    description: 'X3M Primary Orange. Start of signature brand gradient.'
  },
  x3mRed: {
    hex: '#E11D48',
    rgb: '225, 29, 72',
    status: 'official',
    description: 'X3M Primary Red. End of signature brand gradient & urgent deadline alerts.'
  },
  accentYellow: {
    hex: '#FBBF24',
    rgb: '251, 191, 36',
    status: 'official',
    description: 'Accent Yellow for level badges, rating stars, currency, and achievement highlights.'
  },
  charcoal: {
    hex: '#1F2937',
    rgb: '31, 41, 55',
    status: 'official',
    description: 'Charcoal dark neutral for dark surfaces, high-contrast dark text, and HUD containers.'
  },
  lightGrey: {
    hex: '#F3F4F6',
    rgb: '243, 244, 246',
    status: 'official',
    description: 'Light Grey neutral for application background, surface container low, and subtle borders.'
  },
  white: {
    hex: '#FFFFFF',
    rgb: '255, 255, 255',
    status: 'official',
    description: 'Pure White for cards, light surfaces, and on-primary text.'
  },

  // Supporting Semantic Tones (Derived from Brand Guidelines v1.0 UI Elements)
  // MARKED AS PROVISIONAL per brand requirements:
  successGreen: {
    hex: '#10B981',
    rgb: '16, 185, 129',
    status: 'provisional',
    description: 'Derived from "Action Successful!" banner in Brand Guidelines v1.0.'
  },
  successContainer: {
    hex: '#ECFDF5',
    rgb: '236, 253, 245',
    status: 'provisional',
    description: 'Light green surface for success cards and badges.'
  },
  warningAmber: {
    hex: '#F59E0B', // Reuses official X3M Orange
    rgb: '245, 158, 11',
    status: 'official-reused',
    description: 'Reuses official X3M Orange for warning icon and action needed.'
  },
  warningContainer: {
    hex: '#FEF3C7',
    rgb: '254, 243, 199',
    status: 'provisional',
    description: 'Derived from "Please try again" banner in Brand Guidelines v1.0.'
  },
  errorContainer: {
    hex: '#FFE4E6',
    rgb: '255, 228, 230',
    status: 'provisional',
    description: 'Light rose surface for error containers and validation feedback.'
  },
  infoBlue: {
    hex: '#0284C7',
    rgb: '2, 132, 199',
    status: 'provisional',
    description: 'Provisional M3 info color for general office notifications & system hints.'
  },
  infoContainer: {
    hex: '#E0F2FE',
    rgb: '224, 242, 254',
    status: 'provisional',
    description: 'Light blue surface for informational messages.'
  }
};

export const brandGradients = {
  primary: 'linear-gradient(135deg, #F59E0B 0%, #E11D48 100%)',
  primaryHover: 'linear-gradient(135deg, #D97706 0%, #BE123C 100%)',
  primaryActive: 'linear-gradient(135deg, #B45309 0%, #9F1239 100%)',
  accent: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
  charcoalGlass: 'linear-gradient(180deg, rgba(31, 41, 55, 0.95) 0%, rgba(17, 24, 39, 0.98) 100%)'
};

export const brandTypography = {
  fontDisplay: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
  fontBody: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  weights: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  }
};

