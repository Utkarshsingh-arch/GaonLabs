/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      colors: {
        canvas: '#FBFAF9',
        surface: {
          DEFAULT: '#FFFFFF',
          cream: '#FAF5EF',
          ivory: '#F8F4EE',
          sand: '#F3EFE9',
          card: '#FFFFFF',
          border: '#EFECE6',
        },
        skillup: {
          orange: {
            50: '#FFF9F4',
            100: '#FFEEDD',
            200: '#FFD9B8',
            300: '#FFBE8A',
            400: '#FB9C4D',
            500: '#FA9C4D',
            600: '#EB8833',
            700: '#D47220',
            800: '#A1510F',
            900: '#5C2D08',
          },
          yellow: {
            50: '#FFFCF2',
            100: '#FEF7DE',
            200: '#FDEEB4',
            300: '#FCE384',
            400: '#FFCF4F',
            500: '#FAC05E',
            600: '#E5A63D',
          },
          green: {
            50: '#F2FAF5',
            100: '#E8F7EE',
            200: '#CEECDA',
            400: '#5EBE89',
            500: '#48AF76',
            600: '#389461',
          },
          dark: {
            DEFAULT: '#352F2A',
            900: '#231F1C',
            800: '#352F2A',
            700: '#4E4945',
            600: '#636160',
            400: '#9E9B97',
            300: '#C2BEB9',
            200: '#D9D6D0',
            100: '#EFECE6',
          },
        },
      },
      boxShadow: {
        'soft-sm': '0 2px 8px -2px rgba(53, 47, 42, 0.06)',
        'soft-md': '0 8px 24px -4px rgba(53, 47, 42, 0.09)',
        'soft-lg': '0 16px 36px -6px rgba(53, 47, 42, 0.14)',
        'orange-glow': '0 8px 20px -4px rgba(250, 156, 77, 0.38)',
      },
    },
  },
  plugins: [],
};
