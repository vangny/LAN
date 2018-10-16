const path = require('path');
const webpack = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = (env) => {
  console.log(`WEBPACK ENV: ${env}`);

  const isProd = env === 'production';
  const isDev = env === 'development';
  const CLI_DIR = path.join(__dirname, './client');
  const DIST_DIR = path.join(__dirname, './client/dist');

  const AnalyzerPlugin = new BundleAnalyzerPlugin({
    analyzerMode: 'static', // turn on use 'static' - turn off use 'none'
  });

  const CleanPLugin = new CleanWebpackPlugin(['dist'], {
    root: CLI_DIR,
    verbose: true,
    dry: false,
  });

  const HTMLPlugin = new HtmlWebpackPlugin({
    template: `${CLI_DIR}/index.html`,
    filename: `${DIST_DIR}/index.html`,
    chunksSortMode: 'none',
  });

  const GzipPlugin = new CompressionPlugin({
    test: /\.js(\?.*)?$/i,
    algorithm: 'gzip',
    deleteOriginalAssets: true, // change to false to see files in analyzer
    // threshold: 10240,
  });

  const config = {};

  config.entry = `${CLI_DIR}/src/App.jsx`;

  config.output = {
    path: DIST_DIR,
    filename: 'bundle.js',
  };

  // config.node = {
  //   fs: 'empty',
  // };

  config.optimization = {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
          enforce: true,
        },
      },
    },
    runtimeChunk: {
      name: 'manifest',
    },
    minimizer: [
      new UglifyJsPlugin({
        sourceMap: true,
        uglifyOptions: {
          ecma: 8,
          mangle: false,
          keep_classnames: true,
          keep_fnames: true,
        },
      }),
    ],
  };

  config.module = {
    rules: [
      {
        test: /\.(js|jsx)$/, // the $ matches the preceding item zero or one time, so this regex also searches for js files too
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
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader',
        ],
      },
    ],
  };

  config.resolve = {
    extensions: ['.js', '.jsx'],
  };

  config.plugins = [AnalyzerPlugin, CleanPLugin, HTMLPlugin, GzipPlugin];

  if (isProd) {
    config.output = {
      path: DIST_DIR,
      // publicPath: '/',
      chunkFilename: '[name].[chunkhash].bundle.js',
      filename: '[name].[chunkhash].bundle.js',
    };

    config.mode = 'production';
    config.devtool = 'source-map';
  }

  if (isDev) {
    config.output = {
      path: DIST_DIR,
      chunkFilename: '[name].bundle.js',
      filename: '[name].bundle.js',
    };

    config.mode = 'development';
    config.devtool = 'inline-source-map';

    config.devServer = {
      contentBase: DIST_DIR,
      historyApiFallback: false,
    };
  }

  return config;
};
