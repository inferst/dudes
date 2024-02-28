const { join } = require('path');

module.exports = {
  content: [join(__dirname, 'src/**/*.{ts,tsx,html}')],
  theme: {
    extend: {},
  },
  plugins: [],
};
