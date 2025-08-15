/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1D3741',
          dark: '#234755',
        },
        secondary: {
          DEFAULT: '#BD8F9E',
        },
        background: {
          DEFAULT: '#EEEEEE',
          white: '#FFFFFF',
        },
        accent: {
          DEFAULT: '#D1E3E9',
        },
        sidebar: {
          DEFAULT: '#234755',
        },
        text: {
          primary: '#234755',
          secondary: '#1D3741',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};