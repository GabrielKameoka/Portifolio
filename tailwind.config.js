/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.html"], 
  darkMode:"class",
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'], // Registra a fonte
      },
    },
  },
  plugins: [],
};
