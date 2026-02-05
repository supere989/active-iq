/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Active-IQ Terminal Green Theme
                primary: {
                    50: '#f0fdf4',
                    100: '#dcfce7',
                    200: '#bbf7d0',
                    300: '#86efac',
                    400: '#4ade80',
                    500: '#22c55e', // Standard Green
                    600: '#16a34a',
                    700: '#15803d',
                    800: '#166534',
                    900: '#14532d',
                    950: '#052e16',
                },
                // Terminal specific colors
                terminal: {
                    bg: '#0a0a0a',
                    text: '#00ff00',
                    dim: '#00cc00',
                    cursor: '#00ff00',
                }
            },
            fontFamily: {
                mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', "Liberation Mono", "Courier New", 'monospace'],
            },
            animation: {
                'blink': 'blink 1s step-end infinite',
                'type': 'type 3s steps(40, end)',
            },
            keyframes: {
                blink: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0' },
                },
                type: {
                    '0%': { width: '0' },
                    '100%': { width: '100%' },
                }
            }
        },
    },
    plugins: [],
}
