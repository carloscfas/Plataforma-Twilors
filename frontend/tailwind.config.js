const colors = require('./src/configs/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Background colors
        bg: {
          primary: colors.background.primary,
          secondary: colors.background.secondary,
          tertiary: colors.background.tertiary,
          elevated: colors.background.elevated,
        },
        // Text colors
        text: {
          primary: colors.text.primary,
          secondary: colors.text.secondary,
          tertiary: colors.text.tertiary,
          muted: colors.text.muted,
        },
        // Accent colors
        accent: {
          primary: colors.accent.primary,
          secondary: colors.accent.secondary,
          hover: colors.accent.hover,
          light: colors.accent.light,
        },
        // Status colors
        status: {
          live: colors.status.live,
          success: colors.status.success,
          error: colors.status.error,
          warning: colors.status.warning,
        },
        // Border colors
        border: {
          primary: colors.border.primary,
          secondary: colors.border.secondary,
          focus: colors.border.focus,
        },
        // Input colors
        input: {
          bg: colors.input.background,
          border: colors.input.border,
          placeholder: colors.input.placeholder,
        },
        // Card colors
        card: {
          bg: colors.card.background,
          hover: colors.card.hover,
        },
      },
      keyframes: {
        'fade-in-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        }
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.3s ease-out'
      }
    },
  },
  plugins: [],
}