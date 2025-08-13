module.exports = {
    content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                heading: ['Poppins', 'Inter', 'ui-sans-serif', 'system-ui', 'Arial', 'sans-serif'],
                sans: ['Inter', 'system-ui', 'Arial', 'sans-serif'],
                mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
            },
        },
    },
    plugins: [],
};
