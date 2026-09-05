import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#07060C",
        "dusk-wine": "#1A1024",
        paper: "#EDE6D6",
        gold: "#C9A227",
        "gold-soft": "#F4E4A6",
        magenta: "#E11D8F",
        cyan: "#3EE0E8",
        moss: "#1F3D2A",
        chlorophyll: "#7CFF9A",
        /* Compat aliases */
        "solar-gold": "#C9A227",
        violet: "#6B3FA0",
      },
      fontFamily: {
        display: ["var(--font-syne)", "system-ui", "sans-serif"],
        body: ["var(--font-figtree)", "system-ui", "sans-serif"],
      },
      transitionTimingFunction: {
        organic: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      transitionDuration: {
        fast: "160ms",
        medium: "320ms",
        slow: "560ms",
      },
      backgroundImage: {
        "dusk-glow":
          "radial-gradient(ellipse at 20% 0%, rgba(201,162,39,0.1), transparent 50%), radial-gradient(ellipse at 80% 15%, rgba(62,224,232,0.07), transparent 45%), radial-gradient(ellipse at 50% 100%, rgba(124,255,154,0.06), transparent 40%), radial-gradient(ellipse at 55% 40%, rgba(225,29,143,0.05), transparent 35%)",
        /* Compat: old class name → restrained dusk */
        "rave-glow":
          "radial-gradient(ellipse at 20% 0%, rgba(201,162,39,0.1), transparent 50%), radial-gradient(ellipse at 80% 15%, rgba(62,224,232,0.07), transparent 45%), radial-gradient(ellipse at 50% 100%, rgba(124,255,154,0.06), transparent 40%), radial-gradient(ellipse at 55% 40%, rgba(225,29,143,0.05), transparent 35%)",
      },
    },
  },
  plugins: [],
};

export default config;
