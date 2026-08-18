/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: '#050505',
        graphite: '#0d0d0e',
        slate80: '#141416',
        gold: '#d4af37',
        goldsoft: '#a8892c',
        champagne: '#f1e5c8',
        bone: '#fafaf8',
        ash: '#6b6b6b',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        marker: '0.34em',
      },
      transitionTimingFunction: {
        cinematic: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};
