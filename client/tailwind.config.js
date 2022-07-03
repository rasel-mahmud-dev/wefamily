module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#7722E2",
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
        },
        light: {
          10: "#494949",
          50: "#5b5b5b",
          100: "#727272",
          200: "#818181",
          300: "#949494",
          400: "#ababab",
          500: "#b9b9b9",
          600: "#d0d0d0",
          700: "#dcdcdc",
          800: "#eaeaea",
          850: "#f3f3f3",
          900: "#f8f8f8",
        }
      },
      boxShadow: {
        a: "1px 7px 27px -1px #595959"
      }
    },
  },
  plugins: [],
}