module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#ff756b",
        gray: {
          "9": "#eeeeee"
        },
        "gray-dark": {
          "9": "#8c8c8c"
        },
        dark: {
          10: "#fbfcfe",
          50: "#c0c0c0",
          100: "#a2a2a2",
          200: "#838383",
          300: "#696969",
          400: "#525252",
          500: "#444444",
          600: "#363636",
          700: "#252525",
          800: "#171717",
          900: "#0a0a0a",
        }
      },
    },
  },
  plugins: [],
}