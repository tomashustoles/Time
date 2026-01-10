/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        accent: "hsl(var(--accent))",
        muted: "hsl(var(--muted))",
        border: "hsl(var(--border))",
      },
      fontFamily: {
        sans: ["SF Pro Display", "system-ui", "sans-serif"],
        mono: ["SF Mono", "ui-monospace", "monospace"],
      },
      spacing: {
        xs: "var(--spacing-xs)",
        sm: "var(--spacing-sm)",
        md: "var(--spacing-md)",
        lg: "var(--spacing-lg)",
        xl: "var(--spacing-xl)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        full: "var(--radius-full)",
      },
      transitionTimingFunction: {
        "ease-out-expo": "var(--ease-out)",
      },
      transitionDuration: {
        fast: "var(--duration-fast)",
        normal: "var(--duration-normal)",
        slow: "var(--duration-slow)",
      },
      animation: {
        "gradient-shift": "gradient-shift 20s ease infinite",
        "fade-in": "fade-in var(--duration-normal) var(--ease-out)",
        "slide-up": "slide-up var(--duration-normal) var(--ease-out)",
        "slide-down": "slide-down var(--duration-normal) var(--ease-out)",
      },
      keyframes: {
        "gradient-shift": {
          "0%, 100%": { transform: "translate(0%, 0%) rotate(0deg)" },
          "25%": { transform: "translate(5%, 5%) rotate(90deg)" },
          "50%": { transform: "translate(0%, 10%) rotate(180deg)" },
          "75%": { transform: "translate(-5%, 5%) rotate(270deg)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-down": {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
}

