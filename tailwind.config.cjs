/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html",
    "./src/**/*.{jsx,tsx,ts,js}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins",
          "sans-serif"],
        ubuntu: ["Ubuntu",
          "sans-serif"],
      },
    },

  },
  plugins: [

  ],
};