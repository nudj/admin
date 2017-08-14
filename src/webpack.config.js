var path = require('path')
var webpack = require('webpack')
var DirectoryNamedWebpackPlugin = require('directory-named-webpack-plugin')

process.noDeprecation = true

module.exports = {
  cache: true,
  entry: {
    'lib/server/assets/js/app': './lib/app/client'
  },
  output: {
    path: __dirname,
    filename: '[name].js',
    chunkFilename: '[id].js'
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: [
            path.join(__dirname, 'lib'),
            '/tmp/node_modules/@nudj'
        ],
        loader: 'babel-loader',
        options: {
          presets: [
            'react',
            ["env", {
              "targets": {
                "browsers": ["last 2 versions", "safari >= 7"]
              }
            }]
          ]
        }
      }
    ]
  },
  plugins: [
    new webpack.DllReferencePlugin({
      context: '.',
      manifest: require('./vendors-manifest.json')
    })
  ],
  resolve: {
    plugins: [
      new DirectoryNamedWebpackPlugin()
    ]
  },
  stats: {
    colors: true,
    cached: false,
    hash: false,
    timings: false,
    version: false,
    warnings: false
  }
}
