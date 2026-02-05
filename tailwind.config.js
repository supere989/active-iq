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
        terminal: '#1a1a1a',
      },
    },
  },
  plugins: [],
};
