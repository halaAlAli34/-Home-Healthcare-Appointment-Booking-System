import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "#FBFAF5",
          footer: "#F1EDE2",
        },
        hearth: {
          DEFAULT: "#1B3A2B", // primary dark green (buttons, active nav)
          hover: "#15301F",
          light: "#DCEEDD", // pale green for badges/panels
        },
        ink: {
          DEFAULT: "#20241F", // near-black body text
          muted: "#6B6B60", // secondary/gray-brown text
        },
        pending: {
          bg: "#F6E3C6",
          text: "#9A5B22",
        },
        danger: {
          DEFAULT: "#B4483A",
          light: "#F7E4E1",
        },
        border: "#E7E2D4",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        pill: "999px",
      },
    },
  },
  plugins: [],
};

export default config;
