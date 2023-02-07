const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: "/dist/",
  },
  devServer: {
    static: './dist',
  },
  mode: 'development',
  devtool: 'source-map',
};