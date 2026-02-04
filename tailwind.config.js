/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        coffee: "#6b4423",
        cream: "#faf8f5",
        dark: "#2c2520",
        gold: "#d4a574",
      },
      fontFamily: {
        serif: ["'Crimson Pro'", "serif"],
        sans: ["Montserrat", "sans-serif"],
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(30px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        fadeDown: {
          "0%": { opacity: 0, transform: "translateY(-30px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        rotateFloat: {
          "0%,100%": { transform: "rotate(0deg) translateY(0)" },
          "50%": { transform: "rotate(180deg) translateY(-30px)" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.8s ease forwards",
        fadeDown: "fadeDown 0.8s ease forwards",
        float: "float 20s ease-in-out infinite",
        rotateFloat: "rotateFloat 30s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
