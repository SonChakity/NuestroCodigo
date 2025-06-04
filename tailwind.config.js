/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js}",
    "./public/js/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        accent: "#1e40af",
        secondary: "#f97316"
      }
    }
  },
  plugins: []
}
