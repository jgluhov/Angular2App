var webpackMerge = require('webpack-merge');
var ExtractWebpackTextPlugin = require('extract-text-webpack-plugin');
var commonConfig = require('./webpack.common');
var helpers = require('./helpers');

module.exports = webpackMerge(commonConfig, {
  devtool: 'cheap-module-source-map',

  output: {
    path: helpers.root('dist'),
    publicPath: 'http://localhost/',
    filename: '[name].js',
    chunkFilename: '[id].chunk.js'
  },

  plugins: [
    new ExtractWebpackTextPlugin('[name].css')
  ],

  devServer: {
      historyApiFallback: true,
      stats: 'minimal',
      watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
      }
  }
});