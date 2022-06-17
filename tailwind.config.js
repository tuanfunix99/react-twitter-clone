module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      zIndex: {
        100: "100",
      },
      inset: {
        '92': '22rem',
        '100': '32rem'
      }
    },
  },
  important: true,
  plugins: [require("flowbite/plugin")],
  variants: {
    scrollbar: ["dark"],
  },
};
