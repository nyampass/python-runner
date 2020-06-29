const path = require('path')

module.exports = {
  entry: {
    main: './src/main.ts',
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  target: 'node',
  node: {
    __dirname: false,
  },
  externals: {
    "sequelize": "require('sequelize')",
  },
}
