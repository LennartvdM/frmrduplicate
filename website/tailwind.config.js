/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./{pages,shared,lib}/**/*.{js,ts,jsx,tsx}",
    "./*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
