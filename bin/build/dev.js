const webpack = require('webpack')
const merge = require('webpack-merge')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const config = require('./config')
const utils = require('./utils')

const { APP_CONFIG } = config
const baseWebpackConfig = require('./base')

let webpackConfig = merge(baseWebpackConfig, {
  devtool: '#cheap-module-eval-source-map',

  output: {
    path: config[process.env.PACKAGE].assetsRoot,
    filename: utils.assetsPath('js/[name].js'),
    chunkFilename: utils.assetsPath('js/[name].js'),
    publicPath: config[process.env.PACKAGE].assetsPublicPath,
  },

  plugins: [
    new webpack.NamedModulesPlugin(),
    // 热更新
    new webpack.HotModuleReplacementPlugin(),

    new webpack.ProgressPlugin(),

    new ReactRefreshWebpackPlugin({
      overlay: false,
    }),
  ],
})

/**
 * 增加自定义配置功能
 */

if (APP_CONFIG.modify && typeof APP_CONFIG.modify === 'function') {
  webpackConfig = APP_CONFIG.modify(webpackConfig, {
    packageEnv: process.env.PACKAGE,
  })
}

module.exports = webpackConfig
