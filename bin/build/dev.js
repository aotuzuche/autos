const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const config = require('./config')
const utils = require('./utils')
const webpack = require('webpack')
const merge = require('webpack-merge')
const address = require('address')

const APP_CONFIG = config.APP_CONFIG

const port = APP_CONFIG.port

const baseWebpackConfig = require('./base')
// 针对生产环境修改配置
const webpackConfig = merge(baseWebpackConfig, {
  devtool: '#cheap-module-eval-source-map',

  output: {
    path: config[process.env.PACKAGE].assetsRoot,
    filename: utils.assetsPath('js/[name].js'),
    chunkFilename: utils.assetsPath('js/[name].js'),
    publicPath: config[process.env.PACKAGE].assetsPublicPath
  },

  plugins: [
    // 设置环境变量
    new webpack.DefinePlugin({
      'process.env.PACKAGE': JSON.stringify(process.env.PACKAGE)
    }),

    new webpack.NamedModulesPlugin(),
    // 热更新
    new webpack.HotModuleReplacementPlugin(),

    // 美化本地开发时的终端界面
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: [
          `
          本地==> http://localhost:${port}
          路由==> http://${address.ip()}:${port}
          `
        ]
      },
      onErrors: function(severity, errors) {
        console.log(severity, errors)
      }
    })
  ]
})

module.exports = webpackConfig
