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
        void: "#07060B",
        magenta: "#FF2A6D",
        cyan: "#00F0FF",
        violet: "#B14EFF",
        "solar-gold": "#F5C542",
        chlorophyll: "#3DDC97",
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
        "rave-glow":
          "radial-gradient(ellipse at 20% 0%, rgba(255,42,109,0.18), transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(0,240,255,0.12), transparent 45%), radial-gradient(ellipse at 50% 100%, rgba(61,220,151,0.08), transparent 40%)",
      },
    },
  },
  plugins: [],
};

export default config;
