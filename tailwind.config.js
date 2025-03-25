/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        "black-home": "#110d0d",
        "white-home": "#cac9c9",
        "dark-green-home": "#19362d",
        "black-light-home": "#1b1717",
        "green-light-home": "#00a96e",
      }
    },
  },
  plugins: [],
}

