import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          600: '#0A6ED1',
          700: '#0854A0'
        }
      }
    }
  },
  plugins: []
} satisfies Config;
