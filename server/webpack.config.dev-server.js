const nodemonPlugin = require('nodemon-webpack-plugin');
const settings = require('./webpack.config')
const path = require('path')

module.exports = Object.assign({}, settings, {
  plugins: [
    new nodemonPlugin({
      watch: path.resolve('./dist'),
      script: './dist/main.js'
    }),
  ],
})