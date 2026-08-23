import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{js,ts,tsx,jsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        disp: ['var(--font-disp)', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      colors: {
        ink: {
          DEFAULT: '#0b0d08',
          surface: '#10130d',
          card: '#13170f',
          inset: '#0a0c07',
          border: '#252b1e',
          strong: '#39412c',
        },
        accent: {
          DEFAULT: '#c9f158',
          bright: '#d8ff70',
          dark: '#a9cf3e',
          ink: '#171b08',
          dim: 'rgba(201,241,88,.09)',
          glow: 'rgba(201,241,88,.15)',
        },
        body: '#e9ede0',
        muted: '#8b937f',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.97)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        blink: {
          '50%': { opacity: '0.25' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        blink: 'blink 1.6s steps(2, start) infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
