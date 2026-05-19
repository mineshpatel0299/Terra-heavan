import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./app/components/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sand: "#fdfbf7",
        "sand-light": "#ffffff",
        "sand-dark": "#f2f0ea",
        clay: "#c5a059",
        "clay-dark": "#a68a4b",
        earth: "#1c1c1b",
        charcoal: "#111111",
        cream: "#f9f8f4",
        "warm-white": "#ffffff",
        stone: "#a8a8a8",
        sage: "#9ca3af",
        terracotta: "#d4af37",
      },
      fontFamily: {
        cormorant: ["var(--font-cormorant)", "Georgia", "serif"],
        dm: ["var(--font-dm)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.35em",
        widest3: "0.45em",
        widest4: "0.55em",
        widest5: "0.6em",
        widest6: "0.7em",
      },
      boxShadow: {
        luxury: "0 40px 100px rgba(197, 160, 89, 0.08)",
        "luxury-sm": "0 20px 60px rgba(197, 160, 89, 0.05)",
        "inset-vignette": "inset 0 0 250px 80px rgba(0,0,0,0.5)",
      },
      backgroundImage: {
        "gradient-cta": "linear-gradient(135deg, #c5a059 0%, #a68a4b 100%)",
      },
      transitionTimingFunction: {
        luxury: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      },
    },
  },
  plugins: [],
};

export default config;
