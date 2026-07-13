import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        matte: '#0b0b0d',
        accent: {
          teal: '#14b8a6',
          cyan: '#22d3ee',
        },
      },
      boxShadow: {
        glow: '0 0 40px rgba(34, 211, 238, 0.12)',
      },
      backdropBlur: {
        xl: '28px',
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config;

