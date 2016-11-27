const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const helpers = require('./helpers');

module.exports = {
  entry: {
    polyfills: './src/boot/polyfills.ts',
    vendor: './src/boot/vendor.ts',
    main: './src/boot/main.ts'
  },
  output: {
    filename: '[name].js'
  },
  resolve: {
    modulesDirectories: ['node_modules'],
    extensions: ['',  '.js', '.ts', '.styl']
  },
  resolveLoader: {
    modulesDirectories: ['node_modules'],
    extensions: ['',  '.js', '.styl'],
    moduleTemplates: ['*-loader', '*']
  },
  module: {
    loaders: [
      {
        test: /\.ts$/, loaders: [
          'ts-loader',
          'angular2-template-loader',
          'angular2-router-loader'
        ]
      },
      {
        test: /\.html$/, loader: 'html'
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico|svg)/,
        loader: 'file?name=assets/fonts/[name].[hash].[ext]'
      },
      {
        test: /\.css$/,
        exclude: helpers.root('src', 'app'),
        loader: ExtractTextWebpackPlugin.extract('style', 'css?sourceMap')
      },
      {
        test: /\.css$/,
        include: helpers.root('src', 'app'),
        loader: 'raw'
      },
      {
        test: /\.mp3$/,
        loader: 'file?name=assets/media/[name].[hash].[ext]'
      },
      {
        test: /\.styl$/,
        exclude: helpers.root('src', 'boot'),
        loader: 'raw!stylus'
      },
      {
        test: /\.styl$/,
        include: helpers.root('src', 'boot'),
        loader: ExtractTextWebpackPlugin.extract('style', 'css?sourceMap!stylus')
      }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: ['app', 'vendor', 'polyfills']
    }),
    new HtmlWebpackPlugin({
      template: './src/boot/index.html'
    })
  ]
};
