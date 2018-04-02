const path = require('path');
const dotenv = require('dotenv-webpack');

module.exports = {
  entry: path.resolve(__dirname, 'client', 'src', 'index.jsx'),
    // './client/src/index.jsx',

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env', 'react']
          }
        }
      },
    ]
  },

  resolve: {
    extensions: ['.js', '.jsx']
  },

  plugins: [
    new dotenv()
  ],

  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'client', 'dist'),
    publicPath: '/'
  }
};