const colors = require("tailwindcss/colors")

module.exports = {
  mode: "jit",
  purge: [
    "./public/index.html",
    // "./src/**/*.ts",
    "./src/**/*.tsx",
  ],
  theme: {
    fontFamily: {
      text: ["Inter", "system-ui", "sans-serif"],
      code: ["Fira Code", "monospace"]
    },
    colors: {
      transparent: "transparent",
      current: "currentColor",

      white: colors.white,
      black: colors.black,

      gray: colors.coolGray,
      red: colors.red,
      orange: colors.orange,
      yellow: colors.yellow,
      green: colors.green,
      teal: colors.teal,
      blue: colors.sky,
      purple: colors.violet,
      pink: colors.rose,
    }
  },
  variants: {},
  plugins: [],
}
