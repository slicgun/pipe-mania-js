const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const CompressionWebpackPlugin = require('compression-webpack-plugin');

module.exports = {
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  },
  devtool: false,
  entry: './src/main.js',
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    publicPath: '/'
  },
  optimization: {
    usedExports: true,
    minimize: true,
    splitChunks: {
      chunks: 'all',
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src', 'index.html'),
      inject: 'body',
      external: {
        'pixi.js': 'https://cdn.jsdelivr.net/npm/pixi.js@8.x/dist/pixi.min.js',
      }
    }),
    new CopyPlugin({
      patterns: [
        { from: "src/assets", to: "assets" }
      ],
    }),
    new CompressionWebpackPlugin({
      algorithm: 'gzip',
      test: /\.js$|\.html$/,
      threshold: 1024,
      minRatio: 0.8,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif|svg)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/textures/[name][ext]',
        },
      },
    ],
  },
  devServer: {
    static: path.resolve(__dirname, 'dist'),
    port: 3000,
    hot: true
  },
  mode: 'production',
};