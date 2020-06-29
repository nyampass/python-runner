const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
  entry: './src/main.tsx',
  output: {
    globalObject: 'self',
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.ttf$/,
        use: ['file-loader']
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  mode: 'development',
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    }),
    new MonacoWebpackPlugin()
  ]
};
