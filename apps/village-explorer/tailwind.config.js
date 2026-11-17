/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        village: {
          earth: '#8B5A2B',
          green: '#2E7D32',
          soil: '#D7CCC8',
          water: '#0288D1',
          sun: '#FBC02D',
          terracotta: '#D35400',
        },
      },
    },
  },
  plugins: [],
};
