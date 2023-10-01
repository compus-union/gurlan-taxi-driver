/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#ffc409",
        },
        black: {
          DEFAULT: "#424242",
        }
      }
    },
  },
  plugins: [],
}