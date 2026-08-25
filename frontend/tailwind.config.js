/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          950: "#05070f",
          900: "#0a0e1a",
          850: "#10162a",
          800: "#161f38",
          700: "#222f54",
          600: "#36497c",
          cyan: "#00f0ff",
          green: "#00ff66",
          yellow: "#ffcc00",
          orange: "#ff6600",
          red: "#ff003c",
        }
      },
      fontFamily: {
        mono: ["JetBrains Mono", "Fira Code", "Courier New", "monospace"],
        sans: ["Outfit", "Inter", "system-ui", "sans-serif"]
      }
    },
  },
  plugins: [],
}
