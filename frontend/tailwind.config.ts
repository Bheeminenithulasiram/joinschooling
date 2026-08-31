import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
        },
        accent: {
          400: "#fb7185",
          500: "#f43f5e",
          600: "#e11d48",
        },
        ink: {
          900: "#0b1020",
          700: "#1e293b",
          500: "#475569",
          300: "#94a3b8",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        display: ["Sora", "Inter", "system-ui"],
      },
      backgroundImage: {
        "hero-glow":
          "radial-gradient(1200px 600px at 10% -10%, rgba(139,92,246,0.35), transparent 60%),radial-gradient(900px 500px at 90% 0%, rgba(244,63,94,0.25), transparent 60%),radial-gradient(700px 400px at 50% 110%, rgba(56,189,248,0.25), transparent 60%)",
      },
      boxShadow: {
        glow: "0 20px 60px -20px rgba(124,58,237,0.45)",
      },
    },
  },
  plugins: [],
};
export default config;
