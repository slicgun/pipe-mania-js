const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html', // Use your custom HTML file
      inject: 'body', // Inject the script tag into the body
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif|svg)$/, // Enable importing images
        type: 'asset/resource',
      },
    ],
  },
  devServer: {
    static: './dist',
    port: 3000,
    hot: true
  },
  mode: 'development', // Change to 'production' for builds
};