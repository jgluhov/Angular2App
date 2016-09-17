var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
var commonConfig = require('./webpack.common');
var helpers = require('./helpers');

const ENV = process.env.NODE_ENV = process.env.ENV = 'production';

module.exports = webpackMerge(commonConfig, {
  devtool: 'source-map',

  output: {
    path: helpers.root('public'),
    publicPath: '/',
    filename: './js/[name].[hash].js',
    chunkFilename: './js/[id].[hash].chunk.js'
  },

  htmlLoader: {
    minimize: false
  },

  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      mangle: {
        keep_fnames: true
      }
    }),
    new ExtractTextWebpackPlugin('[name].[hash].css'),
    new webpack.DefinePlugin({
      'process.env': {
        'ENV': JSON.stringify(ENV)
      }
    })
  ]
});