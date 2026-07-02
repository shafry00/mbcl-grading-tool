export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bl: {
          red: '#E53E3E',
          'red-dark': '#C53030',
          'red-light': '#FFF5F5',
          'red-mid': '#FED7D7',
          blue: '#2563EB',
          'blue-dark': '#1D4ED8',
          'blue-light': '#EFF6FF',
          'blue-mid': '#BFDBFE',
        },
      },
      boxShadow: {
        card: '0 2px 12px 0 rgba(0,0,0,0.08)',
        'card-hover': '0 6px 24px 0 rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
