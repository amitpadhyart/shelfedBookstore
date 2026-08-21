import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.25rem", md: "2rem", lg: "3rem" },
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        // Paper — warm putty/oat, not the generic cream default
        paper: {
          DEFAULT: "#EFEAE0",
          warm: "#E4DCC8",
          soft: "#F5F2EA",
        },
        // Ink — warm near-black text
        ink: {
          DEFAULT: "#221F1A",
          soft: "#55503F",
          faint: "#8A8371",
        },
        // Primary accent — "Daunt green", spine cloth
        spine: {
          DEFAULT: "#2F4538",
          light: "#3F5D4A",
          dark: "#1E2E24",
        },
        // Secondary accent — foil brass, used for price/metadata highlights
        brass: {
          DEFAULT: "#A97B32",
          light: "#C79A4F",
          dark: "#7C5A22",
        },
        // Tertiary accent — leather wine, genre tags / ratings
        wine: {
          DEFAULT: "#6B2E3B",
          light: "#8A4152",
        },
        // Quiet fourth — cloth blue, links / hover states
        cloth: {
          DEFAULT: "#3A4A5C",
          light: "#516278",
        },
        // Dark mode surfaces — reading lamp at night
        night: {
          DEFAULT: "#1B1D17",
          surface: "#24261F",
          soft: "#2E3128",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        body: ["var(--font-franklin)", "system-ui", "sans-serif"],
        mono: ["var(--font-plex-mono)", "ui-monospace", "monospace"],
        hand: ["var(--font-caveat)", "cursive"],
      },
      fontSize: {
        "display-xl": ["clamp(2.75rem, 6vw, 5.5rem)", { lineHeight: "0.98", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(2.25rem, 4.5vw, 3.75rem)", { lineHeight: "1.02", letterSpacing: "-0.015em" }],
        "display-md": ["clamp(1.75rem, 3vw, 2.5rem)", { lineHeight: "1.08", letterSpacing: "-0.01em" }],
      },
      backgroundImage: {
        "paper-grain":
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E\")",
      },
      boxShadow: {
        shelf: "0 1px 0 0 rgba(34,31,26,0.08), 0 12px 24px -12px rgba(34,31,26,0.18)",
        card: "0 8px 20px -10px rgba(34,31,26,0.25)",
        pin: "0 2px 4px rgba(34,31,26,0.25)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pin-in": {
          "0%": { opacity: "0", transform: "rotate(-6deg) scale(0.92)" },
          "100%": { opacity: "1", transform: "rotate(-2deg) scale(1)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.22,1,0.36,1) both",
        "pin-in": "pin-in 0.5s cubic-bezier(0.22,1,0.36,1) both",
      },
      transitionTimingFunction: {
        book: "cubic-bezier(0.22,1,0.36,1)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
