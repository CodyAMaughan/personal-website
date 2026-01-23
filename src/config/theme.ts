// Palette Primitives
const colors = {
  obsidian: '#05050A', // Deepest black-blue
  charcoal: '#0F1115', // Card background

  // Accents
  cyan: '#00F0FF',     // Electric Cyan (Code/Logic)
  violet: '#7000FF',   // Deep Violet (Creative)
  magenta: '#FF003C',  // Hot Magenta (Action)

  // Neutrals
  white: '#FFFFFF',
  gray200: '#E4E4E7',
  gray400: '#A1A1AA',
  gray600: '#52525B',
  gray800: '#27272A',
  gray900: '#18181B',
};

export const theme = {
  colors: {
    background: colors.obsidian,

    // Surface & Glass
    surface: 'rgba(255, 255, 255, 0.03)',
    surfaceHighlight: 'rgba(255, 255, 255, 0.08)',
    border: 'rgba(255, 255, 255, 0.1)',

    // Brand
    primary: colors.cyan,
    primaryHover: '#33F3FF',

    secondary: colors.violet,
    accent: colors.magenta,

    // Text
    text: colors.white,
    textMuted: colors.gray400,
  },
  fonts: {
    sans: '"Inter", sans-serif',
    mono: '"JetBrains Mono", monospace',
  },
  borderRadius: {
    default: '0.75rem',
    card: '1.25rem',
  }
};

export type Theme = typeof theme;
