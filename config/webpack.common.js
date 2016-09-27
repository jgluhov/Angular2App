var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
var helpers = require('./helpers');

module.exports = {
  entry: {
    polyfills: './src/polyfills.ts',
    vendor: './src/vendor.ts',
    app: './src/main.ts'
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
  watch: true,
  module: {
    loaders: [
      {
        test: /\.ts$/, loaders: ['ts-loader', 'angular2-template-loader']
      },
      {
        test: /\.html$/, loader: 'html'
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        loader: 'file?name=assets/[name].[hash].[ext]'
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
        test: /\.styl$/,
        include: helpers.root('src', 'app'),
        loader: 'raw!stylus'
      },
      {
        test: /\.styl$/,
        exclude: helpers.root('src', 'app'),
        loader: ExtractTextWebpackPlugin.extract('style', 'css?sourceMap!stylus')
      }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: ['app', 'vendor', 'polyfills']
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ]
};
