/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0A0A0A",
        surface: "#111111",
        ink: {
          DEFAULT: "#FAFAFA",
          soft: "rgba(250,250,250,0.64)",
          faint: "rgba(250,250,250,0.38)",
        },
        line: "rgba(255,255,255,0.06)",
        veil: "rgba(255,255,255,0.03)",
        gold: {
          DEFAULT: "#C6B59C",
          bright: "#D8CAB4",
          deep: "#968773",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["\"Instrument Serif\"", "ui-serif", "Georgia", "serif"],
        mono: ["\"JetBrains Mono\"", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      fontSize: {
        display: ["clamp(3.375rem, 7vw, 6rem)", { lineHeight: "0.98", letterSpacing: "-0.01em" }],
        h1: ["clamp(2.5rem, 5.5vw, 4.5rem)", { lineHeight: "1.03", letterSpacing: "-0.01em" }],
        h2: ["clamp(1.875rem, 4vw, 3rem)", { lineHeight: "1.1" }],
        h3: ["clamp(1.3125rem, 2.5vw, 1.875rem)", { lineHeight: "1.25" }],
        base: ["1.0625rem", { lineHeight: "1.6" }],
        small: ["0.8125rem", { lineHeight: "1.5" }],
        eyebrow: ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.35em" }],
      },
      letterSpacing: {
        widest2: "0.28em",
        widest3: "0.35em",
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
