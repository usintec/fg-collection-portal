/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark_green: '#204458',
        green_regular: '#5D9799',
        input_mint: '#EEF8FC',
        white_green: '#DFF6E5',
        custom_mint: "#CADFEB",
        bg_mint: "#EEF6FA"
      }
    },
  },
  plugins: [],
}
