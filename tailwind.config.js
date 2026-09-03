/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0B0B0B",
          soft: "#52514E",
        },
        gold: {
          DEFAULT: "#C9A24C",
          bright: "#D9BC72",
          deep: "#9C7A32",
        },
        stone: {
          DEFAULT: "#78716C",
          light: "#A8A29E",
        },
        paper: "#FAF7F2",
        card: "#FFFFFF",
        border: "#E7E1D6",
      },
      fontFamily: {
        display: ["Cinzel", "ui-serif", "Georgia", "serif"],
        body: ["Josefin Sans", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.28em",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};
