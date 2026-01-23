// theme.ts

// Palette Primitives
const colors = {
  // Backgrounds: Moving away from purple-tinted black to "Carbon" & "Gunmetal"
  carbon: '#0a0a0a',     // Pure dark background
  gunmetal: '#171717',   // Slightly lighter (Card background)

  // Accents: The "Terminal" Spectrum
  terminalGreen: '#4ade80', // Bright, readable modern green (Tailwind Green-400)
  emerald: '#10b981',       // Deeper, stable green (for borders/secondary)
  forest: '#064e3b',        // Very dark green (for subtle gradients)

  // Secondary Accents (To support the green without fighting it)
  electricBlue: '#3b82f6',  // Standard "Link" blue - sits well with green
  amber: '#f59e0b',         // "Warning" yellow - great for "In Progress" tags

  // Neutrals
  white: '#FFFFFF',
  gray100: '#f5f5f5',
  gray300: '#d4d4d4',
  gray500: '#737373',
  gray700: '#404040',
  gray800: '#262626',
};

export const theme = {
  colors: {
    background: colors.carbon,

    // Surface & Glass
    // We use a slight green tint in the surface to mesh with the primary
    surface: 'rgba(23, 23, 23, 0.6)',
    surfaceHighlight: 'rgba(74, 222, 128, 0.05)', // Very faint green glow
    border: colors.gray800,
    borderHighlight: colors.forest, // Greenish border for active items

    // Brand
    primary: colors.terminalGreen,
    primaryHover: '#22c55e', // Slightly darker on hover

    // Secondary is now a "support" color, not a competing bright color
    secondary: colors.electricBlue,
    accent: colors.amber, // Use sparingly for "Beta" or "New" badges

    // Text
    text: colors.white,
    textMuted: colors.gray500, // Tech grey
    textCode: colors.terminalGreen, // Specific color for code snippets
  },
  fonts: {
    sans: '"Inter", sans-serif',
    mono: '"JetBrains Mono", monospace',
  },
  borderRadius: {
    default: '0.5rem', // Tighter radius fits the "Terminal" look better
    card: '0.75rem',
  }
};

export type Theme = typeof theme;