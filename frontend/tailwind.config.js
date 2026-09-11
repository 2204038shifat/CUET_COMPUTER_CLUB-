/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./pages/**/*.html",
    "./js/**/*.js"
  ],

  theme: {
    extend: {
      colors: {
        club: {
          primary: "#24316E",
          "primary-dark": "#16204A",
          "primary-light": "#4C5FA8",

          secondary: "#5B3E8E",

          accent: "#C9A227",

          background: "#F6F7FB",
          surface: "#FFFFFF",
          "surface-muted": "#EDEFF6",

          "text-primary": "#111827",
          "text-secondary": "#475569",
          "text-muted": "#6B7280",

          border: "#E2E5EC",

          success: "#15803D",
          warning: "#B45309",
          danger: "#DC2626",
          info: "#2563EB"
        }
      },

      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif"
        ]
      },

      maxWidth: {
        club: "80rem"
      },

      borderRadius: {
        "club-sm": "0.375rem",
        club: "0.625rem",
        "club-lg": "1rem"
      },

      boxShadow: {
        "club-sm": "0 1px 2px rgba(15, 23, 42, 0.05)",
        club: "0 4px 12px rgba(15, 23, 42, 0.08)",
        "club-md": "0 8px 24px rgba(15, 23, 42, 0.10)",
        "club-lg": "0 16px 40px rgba(15, 23, 42, 0.12)"
      }
    }
  },

  plugins: []
};