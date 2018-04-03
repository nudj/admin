const webpack = require('webpack')
const path = require('path')
const nodeExternals = require('webpack-node-externals')
const StartServerPlugin = require('start-server-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
  entry: ['webpack/hot/poll?1000', './app/server'],
  output: {
    path: path.resolve(__dirname, 'app/server'),
    filename: 'hot-build.js',
    hotUpdateChunkFilename: 'hot/hot-[hash].js',
    hotUpdateMainFilename: 'hot/hot-[hash].json'
  },
  watch: true,
  target: 'node',
  externals: [
    nodeExternals({
      whitelist: ['webpack/hot/poll?1000']
    })
  ],
  module: {
    rules: [
      {
        test: /\.js?$/,
        use: 'babel-loader',
        include: [
          path.join(__dirname, 'app'),
          path.join(__dirname, '@nudj'),
          path.join(__dirname, 'node_modules', '@nudj')
        ],
        exclude: [
          /\/usr\/src\/(node_modules\/)?@nudj\/.*\/node_modules\/.*/,
          path.join(__dirname, 'app/server/hot-build.js'),
          path.join(__dirname, 'app/server/hot')
        ]
      }
    ]
  },
  cache: false,
  plugins: [
    new StartServerPlugin({
      name: 'hot-build.js'
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.EnvironmentPlugin({
      NODE_ENV: process.env.NODE_ENV,
      ENVKEY: process.env.ENVKEY
    }),
    /**
     * NOTE: This is a destructive action. Changing this file path may result in
     * undesired removal of files
     */
    new CleanWebpackPlugin([
      path.join(__dirname, 'app/server/hot')
    ], {
      verbose: true,
      beforeEmit: true,
      watch: true
    })
  ]
}
