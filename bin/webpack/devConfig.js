const webpack = require('webpack')
const { merge } = require('webpack-merge')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const config = require('../config')
const getBaseConfig = require('./baseConfig')
const { assetsPath } = require('../utils')

module.exports = async function getDevConfig(options) {
  const baseConfig = await getBaseConfig(options)

  return merge(baseConfig, {
    output: {
      path: config[process.env.PACKAGE].assetsRoot,
      filename: assetsPath('js/[name].js'),
      chunkFilename: assetsPath('js/[name].js'),
      publicPath: config[process.env.PACKAGE].assetsPublicPath,
    },

    plugins: [
      new webpack.HotModuleReplacementPlugin(),

      new webpack.ProgressPlugin(),

      new ReactRefreshWebpackPlugin({
        overlay: false,
      }),
    ],
  })
}
