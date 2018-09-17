require('envkey')
var path = require('path')
var webpack = require('webpack')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

process.noDeprecation = true

console.log('Building for environment:', process.env.NODE_ENV)

const plugins = [
  new webpack.DllReferencePlugin({
    context: '.',
    manifest: require('./vendors-manifest.json')
  }),
  new webpack.EnvironmentPlugin([
    'NODE_ENV',
    'USE_DEV_SERVER',
    'DEV_SERVER_PATH',
    'ANALYTICS_ENABLED',
    'MIXPANEL_API_TOKEN'
  ]),
  process.env.USE_DEV_SERVER && new webpack.HotModuleReplacementPlugin(),
  process.env.USE_DEV_SERVER && new webpack.NamedModulesPlugin(),
  process.env.DEBUG !== 'true' && new UglifyJSPlugin()
].filter(plugin => plugin)

const config = {
  cache: true,
  entry: {
    app: [
      process.env.USE_DEV_SERVER && 'react-hot-loader/patch',
      process.env.USE_DEV_SERVER && `webpack-dev-server/client?${process.env.DEV_SERVER_PATH}`,
      process.env.USE_DEV_SERVER && 'webpack/hot/only-dev-server',
      './app/client'
    ].filter(entry => entry)
  },
  output: {
    path: path.resolve(__dirname, 'app/server/build'),
    filename: '[name].js',
    chunkFilename: '[id].js',
    publicPath: `${process.env.DEV_SERVER_PATH}/build/`
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
        exclude: /node_modules\/(?!@nudj)/,
        loader: 'babel-loader',
        options: {
          babelrc: false,
          presets: [
            'react',
            'flow',
            [
              'env',
              {
                targets: {
                  browsers: ['last 2 versions', 'safari >= 7']
                }
              }
            ]
          ],
          plugins: [
            'babel-plugin-transform-class-properties',
            'babel-plugin-transform-object-rest-spread'
          ]
        }
      }
    ]
  },
  resolve: {
    mainFields: ['main']
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

if (process.env.USE_DEV_SERVER) {
  config.devServer = {
    contentBase: path.resolve(__dirname, 'app/server'),
    host: '0.0.0.0',
    port: '83',
    publicPath: '/build/',
    public: process.env.DEV_SERVER_PATH,
    https: false,
    hot: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
    disableHostCheck: true
  }
}

module.exports = config
