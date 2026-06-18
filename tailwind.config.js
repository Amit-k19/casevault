/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ["Georgia", "Cambria", "serif"],
      },
      colors: {
        ink: "#10172A",
        cream: "#F7F4ED",
        gold: "#A8762B",
      },
    },
  },
  plugins: [],
};
