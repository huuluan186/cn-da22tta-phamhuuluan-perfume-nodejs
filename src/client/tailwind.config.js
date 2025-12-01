/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        './public/index.html'
    ],
    theme: {
        extend: {
            colors: {
                primary: '#07503D',
                light: '#F5F5F5',
                contentBg: "#FFF",
                navBgHover: '#7ffbad',
                secondary: '#032119',
            },
            container: {
                center: true,          // căn giữa tự động
                padding: {
                    DEFAULT: '1rem',     // padding cho mobile
                    sm: '1rem',          // padding cho màn hình nhỏ
                    lg: '2rem',          // padding cho màn hình lớn
                    xl: '4rem',          // padding cho xl trở lên
                },
            },
        },
    },
    plugins: [],
}

