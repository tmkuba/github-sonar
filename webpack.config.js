const path = require('path');
const dotenv = require('dotenv');
const webpack = require('webpack');
dotenv.config();

const config = {
  entry: path.resolve(__dirname, 'client', 'src', 'index.jsx'),

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
    new webpack.EnvironmentPlugin(['GOOGLE_API_KEY', 'AJAX_URL']),
  ],

  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'client', 'dist'),
    publicPath: '/'
  }
};

module.exports = (env, argv) => {
  return config;
};