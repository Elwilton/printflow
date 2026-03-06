/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: "#0A0A0F",
        surface: "#13131A",
        separator: "#1E1E2E",
        accent: "#FF6B2B",
        success: "#2ECC71",
        warning: "#F1C40F",
        danger: "#E74C3C",
        info: "#3B82F6",
        "text-main": "#F0F0F5",
        "text-muted": "#6B6B80",
        "text-dim": "#9090A8",
      },
    },
  },
  plugins: [],
};
