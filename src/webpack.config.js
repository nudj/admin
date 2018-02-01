var path = require('path')
var webpack = require('webpack')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

process.noDeprecation = true

console.log('Building for environment:', process.env.NODE_ENV)

let plugins = [
  new webpack.DllReferencePlugin({
    context: '.',
    manifest: require('./vendors-manifest.json')
  }),
  new webpack.EnvironmentPlugin(['NODE_ENV'])
]
if (process.env.DEBUG !== 'true') {
  plugins = plugins.concat([
    new UglifyJSPlugin()
  ])
}

module.exports = {
  cache: true,
  entry: {
    'app/server/build/app': './app/client'
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
          path.join(__dirname, 'app'),
          path.join(__dirname, '@nudj'),
          path.join(__dirname, 'node_modules', '@nudj')
        ],
        loader: 'babel-loader',
        options: {
          presets: [
            'react',
            'flow',
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
  plugins,
  stats: {
    colors: true,
    cached: false,
    hash: false,
    timings: false,
    version: false,
    warnings: false
  }
}
