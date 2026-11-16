/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f5ff',
          100: '#e0ecff',
          200: '#c7dcfe',
          300: '#9fc2fd',
          400: '#709dfa',
          500: '#4a7af6',
          600: '#2557eb',
          700: '#1d42d8',
          800: '#1b37af',
          900: '#1c328a',
          950: '#111f55',
        }
      }
    },
  },
  plugins: [],
}
