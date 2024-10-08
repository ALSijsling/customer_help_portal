/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './resources/js/**/*',
    './node_modules/flowbite/**/*.js'
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('flowbite/plugin')
  ],
}