/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Screenshot exact color system:
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
            400: '#FB9C4D', // Primary hero & accent orange
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
            400: '#FFCF4F', // Sunshine active day badge
            500: '#FAC05E',
            600: '#E5A63D',
          },
          green: {
            50: '#F2FAF5',
            100: '#E8F7EE',
            200: '#CEECDA',
            400: '#5EBE89',
            500: '#48AF76', // Checkmark & completed badge
            600: '#389461',
          },
          dark: {
            DEFAULT: '#352F2A', // Main typography
            900: '#231F1C',
            800: '#352F2A',
            700: '#4E4945',
            600: '#636160', // Body & subtitle
            400: '#9E9B97', // Placeholder & captions
            300: '#C2BEB9',
            200: '#D9D6D0', // Card borders
            100: '#EFECE6',
          },
        },
        // Backwards compatibility aliases mapped to screenshot colors:
        brand: {
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
        earth: {
          50: '#FBFAF9',
          100: '#FAF5EF',
          200: '#F8F4EE',
          300: '#F3EFE9',
          600: '#636160',
          800: '#352F2A',
        }
      },
      boxShadow: {
        'soft-sm': '0 2px 8px -2px rgba(53, 47, 42, 0.05)',
        'soft-md': '0 8px 24px -4px rgba(53, 47, 42, 0.07)',
        'soft-lg': '0 16px 36px -6px rgba(53, 47, 42, 0.1)',
        'orange-glow': '0 8px 20px -4px rgba(250, 156, 77, 0.35)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
};
