/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#090909",
        surface: "#111111",
        ink: {
          DEFAULT: "#F4F1EA",
          soft: "rgba(244,241,234,0.64)",
          faint: "rgba(244,241,234,0.4)",
        },
        line: "rgba(255,255,255,0.08)",
        beige: "#C8BBA8",
        stone: "#918576",
        gold: {
          DEFAULT: "#B8A486",
          bright: "#CDBB9C",
          deep: "#8F7E63",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["\"Instrument Serif\"", "ui-serif", "Georgia", "serif"],
        mono: ["\"JetBrains Mono\"", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      fontSize: {
        display: ["clamp(3.5rem, 8vw, 7.25rem)", { lineHeight: "0.98", letterSpacing: "-0.01em" }],
        h1: ["clamp(2.625rem, 6vw, 5.125rem)", { lineHeight: "1.02", letterSpacing: "-0.01em" }],
        h2: ["clamp(2rem, 4vw, 3.375rem)", { lineHeight: "1.08" }],
        h3: ["clamp(1.375rem, 2.5vw, 2rem)", { lineHeight: "1.2" }],
        base: ["1rem", { lineHeight: "1.6" }],
        small: ["0.8125rem", { lineHeight: "1.5" }],
        eyebrow: ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.32em" }],
      },
      letterSpacing: {
        widest2: "0.28em",
        widest3: "0.32em",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
