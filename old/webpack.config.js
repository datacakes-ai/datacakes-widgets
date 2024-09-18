const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');

const entry = {};
const components = fs
  .readdirSync(path.join(__dirname, 'src'))
  .filter(file => file.endsWith('.js'));
components.forEach(component => {
  const name = component.split('.js')[0];
  entry[name] = `./src/${component}`;
});

module.exports = {
  mode: 'development',
  entry,
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'public', 'index.html'),
      hash: true,
    }),
  ],
};
