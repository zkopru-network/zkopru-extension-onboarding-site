module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: 'Poppins, sans-serif',
            },
            colors: {
                wblue: '#405ae0',
                wlilac: '#AB61E5',
                'wblue-light': '#E3E7FF',
                'wlilac-light': '#FAE5FF',
                'wblue-dark': '#444368',
            },
        },
    },
    plugins: [],
};
