import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },

  daisyui: {
    themes: [
      {
        colors: {
          current: "currentColor",
          primary: "#b39c88",
          secondary: "#5C4033",
          white: "#D9D9D9",
          stroke: "#EEEEEE",
          strokedark: "#2D2F40",
          manatee: "#999AA1",
          waterloo: "#757693",
          blacksection: "#1C2136",
        },
      },
    ],
  },

  plugins: [require("daisyui")],
};
export default config;
