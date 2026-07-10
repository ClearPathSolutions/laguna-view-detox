import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./content/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep navy-teal — primary dark (from brand logo block)
        navy: {
          DEFAULT: "#0e3e5a",
          50: "#eef4f8",
          100: "#d3e2ec",
          200: "#a7c5d9",
          300: "#6f9db9",
          400: "#3d7396",
          500: "#1c5578",
          600: "#0e3e5a",
          700: "#0b3149",
          800: "#082638",
          900: "#061d2b",
          950: "#04121b",
        },
        // Luxury gold — accent (from brand wordmark)
        gold: {
          DEFAULT: "#ba9b59",
          50: "#faf6ee",
          100: "#f2e9d3",
          200: "#e7d2a8",
          300: "#d9b878",
          400: "#cba35c",
          500: "#ba9b59",
          600: "#a07f42",
          700: "#836537",
          800: "#6d5331",
          900: "#5c462d",
        },
        // Warm sand / cream neutrals
        sand: {
          DEFAULT: "#f6f1e9",
          50: "#fbf9f5",
          100: "#f6f1e9",
          200: "#ece2d3",
          300: "#ddccb3",
        },
        ink: "#16242c",
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        container: "1240px",
        prose: "68ch",
      },
      boxShadow: {
        soft: "0 10px 40px -12px rgba(14, 62, 90, 0.18)",
        card: "0 18px 50px -20px rgba(6, 29, 43, 0.35)",
        lift: "0 24px 70px -24px rgba(6, 29, 43, 0.45)",
      },
      letterSpacing: {
        eyebrow: "0.22em",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
        "fade-in": "fade-in 0.9s ease both",
      },
    },
  },
  plugins: [],
};

export default config;
