/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {},
    },
    variants: {
        typography: ["responsive", "dark"]
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
};