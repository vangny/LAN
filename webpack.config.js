const HtmlWebPackPlugin = require('html-webpack-plugin');
const path = require('path');

const CLI_DIR = path.join(__dirname, './client');
const DIST_DIR = path.join(__dirname, './client/dist');

module.exports = {
  entry: `${CLI_DIR}/src/App.jsx`,
  output: {
    path: DIST_DIR,
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.jsx$/, // the $ matches the preceding item zero or one time, so this regex also searches for js files too
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          require.resolve('style-loader'),
          {
            loader: require.resolve('css-loader'),
            options: {
              importLoaders: 1,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: `${CLI_DIR}/index.html`,
      filename: `${DIST_DIR}/index.html`,
    }),
  
  ],
};