/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    fontFamily: {
      mono: ['"JetBrains Mono"', 'monospace'],
    },
    extend: {
      colors: {
        void: '#050505',
        phosphor: '#00FF00',
        amber: '#FFAA00',
        offwhite: '#E0E0E0',
        terminal: {
          bg: '#050505',
          text: '#e0e0e0',
        },
        primary: {
          400: '#4ade80',
          500: '#00ff00',
          600: '#16a34a',
          900: '#052e16',
        },
      },
    },
  },
  plugins: [],
};
