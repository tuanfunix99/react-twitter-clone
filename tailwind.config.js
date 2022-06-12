module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  important: true,
  plugins: [require("flowbite/plugin")],
  variants: {
    scrollbar: ["dark"],
  },
};
