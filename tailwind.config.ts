import type { Config } from 'tailwindcss';

export default {
  darkMode: 'media',
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
        inter: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        blob: {
          '0%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(8px, -6px) scale(1.05)' },
          '66%': { transform: 'translate(-6px, 4px) scale(0.98)' },
          '100%': { transform: 'translate(0, 0) scale(1)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        blob: 'blob 8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;

