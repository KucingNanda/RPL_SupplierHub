/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Mendefinisikan warna sesuai Laporan Palette PasarKita
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        status: {
          success: '#15803d', // Green-700
          warning: '#b45309', // Amber-700
          danger: '#b91c1c',  // Red-700
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}