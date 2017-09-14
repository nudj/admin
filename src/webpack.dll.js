var webpack = require('webpack')
module.exports = {
  entry: {
    'app/server/assets/js/vendors': ['./app/vendors']
  },
  output: {
    path: __dirname,
    filename: '[name].js',
    chunkFilename: '[id].js',
    library: 'vendors',
  },
  plugins: [
    new webpack.DllPlugin({
      name: 'vendors',
      path: './vendors-manifest.json',
    })
  ]
}
