const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');

// Clean up old color aliases that enrage the compiler
const oldColors = ['lightBlue', 'warmGray', 'trueGray', 'blueGray', 'coolGray'];
oldColors.forEach((c) => {
  delete colors[c];
});

const config = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      width: {
        68: '17rem',
        128: '26rem',
        144: '48ch',
        160: '32rem',
        192: '42rem',
      },
    },
    container: {
      padding: {
        DEFAULT: '2rem',
        xs: '1rem',
      },
    },
    fontSize: {
      ...defaultTheme.fontSize,
      '8xl': '5rem',
    },
    fontFamily: {
      ...defaultTheme.fontFamily,
      sans: ['Open Sans', ...defaultTheme.fontFamily.sans],
      lucky: ['Luckiest Guy'],
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    styled: true,
    themes: false,
  },
};

module.exports = config;
