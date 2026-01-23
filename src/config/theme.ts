export const theme = {
  colors: {
    background: '#0a0a0a', // Zinc-950
    surface: '#18181b', // Zinc-900
    surfaceHighlight: '#27272a', // Zinc-800
    primary: '#3b82f6', // Blue-500
    primaryHover: '#2563eb', // Blue-600
    secondary: '#a1a1aa', // Zinc-400
    secondaryHover: '#d4d4d8', // Zinc-300
    accent: '#8b5cf6', // Violet-500
    text: '#f4f4f5', // Zinc-100
    textMuted: '#71717a', // Zinc-500
    border: '#27272a', // Zinc-800
  },
  fonts: {
    sans: '"Inter", sans-serif',
    mono: '"JetBrains Mono", monospace', // Good for technical founder vibe
  },
  borderRadius: {
    default: '0.75rem', // Rounded-xl
    card: '1rem', // Rounded-2xl
  }
};

export type Theme = typeof theme;
