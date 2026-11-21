/**
 * Centralized 3D Environment Materials & Visual Tokens
 * Requirement 5: Keep 3D environment materials and colours in a centralised configuration
 * that can be adjusted independently of individual 3D objects.
 *
 * All colours map directly to the central brand and M3 semantic tokens.
 */

import { brandColors } from './brand.js';

export const office3DTheme = {
  // Brand Accent Features (Reception, Planters, Brand Walls)
  brandAccents: {
    primaryOrange: {
      color: brandColors.x3mOrange.hex,
      roughness: 0.35,
      metalness: 0.05,
      description: 'Used for X3M brand feature planters, signage, and primary brand accents'
    },
    primaryRed: {
      color: brandColors.x3mRed.hex,
      roughness: 0.35,
      metalness: 0.05,
      description: 'Used for X3M accent walls and reception focal points'
    },
    goldAccent: {
      color: brandColors.accentYellow.hex,
      roughness: 0.2,
      metalness: 0.6,
      description: 'Used for 3D achievement trophies, coins, and level star props'
    }
  },

  // Architecture & Structural Materials
  architecture: {
    floor: {
      color: brandColors.lightGrey.hex, // #F3F4F6
      roughness: 0.85,
      metalness: 0.05,
      description: 'Main agency office floor surface'
    },
    walls: {
      color: '#FAFAFA',
      roughness: 0.9,
      metalness: 0.0,
      description: 'Drywall partition and primary office perimeter'
    },
    ceiling: {
      color: '#FFFFFF',
      roughness: 0.95,
      metalness: 0.0,
      description: 'Acoustic ceiling tiles & ceiling grid'
    },
    trimAndMullions: {
      color: brandColors.charcoal.hex, // #1F2937
      roughness: 0.4,
      metalness: 0.5,
      description: 'Window frames, glass partitions and structural metal pillars'
    },
    glassPartition: {
      color: '#E0F2FE',
      opacity: 0.25,
      transparent: true,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.9,
      description: 'Meeting room glass walls and executive partitions'
    }
  },

  // Office Workstation & Furniture Materials
  furniture: {
    deskSurface: {
      color: '#F8FAFC',
      roughness: 0.5,
      metalness: 0.0,
      description: 'Workstation desktop surface'
    },
    deskFrame: {
      color: brandColors.charcoal.hex,
      roughness: 0.3,
      metalness: 0.7,
      description: 'Powder-coated metal desk frame'
    },
    ergonomicChair: {
      color: brandColors.charcoal.hex,
      roughness: 0.75,
      metalness: 0.1,
      description: 'Task chair fabric and mesh'
    },
    planterFoliage: {
      color: '#15803D',
      roughness: 0.6,
      metalness: 0.0,
      description: 'Indoor plant leaves and greenery'
    }
  },

  // Environment Lighting Presets
  lighting: {
    ambient: {
      color: '#FFFFFF',
      intensity: 0.75
    },
    hemisphere: {
      skyColor: '#FFFFFF',
      groundColor: brandColors.charcoal.hex,
      intensity: 0.45
    },
    keyLight: {
      color: '#FFFFFF',
      intensity: 1.6,
      castShadow: true
    },
    fillLight: {
      color: '#93C5FD',
      intensity: 0.6
    },
    rimLight: {
      color: brandColors.x3mOrange.hex,
      intensity: 0.35
    }
  },

  // Ground Grid & Floor Marker
  grid: {
    cellSize: 0.25,
    sectionSize: 1.0,
    sectionColor: brandColors.x3mOrange.hex,
    cellColor: brandColors.charcoal.hex,
    fadeDistance: 25,
    fadeStrength: 1.5
  }
};

