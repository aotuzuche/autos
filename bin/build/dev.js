const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const config = require('./config')
const utils = require('./utils')
const webpack = require('webpack')
const merge = require('webpack-merge')

const chalk = require('chalk')

const rules = [
  {
    type: 'cant-resolve-loader',
    re: /Can't resolve '(.*loader)'/,
    msg: (e, match) =>
      `Failed to resolve loader: ${chalk.yellow(match[1])}\n` +
      `You may need to install it.`
  }
]

const transformer = error => {
  if (error.webpackError) {
    const message =
      typeof error.webpackError === 'string'
        ? error.webpackError
        : error.webpackError.message || ''
    for (const { re, msg, type } of rules) {
      const match = message.match(re)
      if (match) {
        return Object.assign({}, error, {
          // type is necessary to avoid being printed as defualt error
          // by friendly-error-webpack-plugin
          type,
          shortMessage: msg(error, match)
        })
      }
    }
    // no match, unknown webpack error without a message.
    // friendly-error-webpack-plugin fails to handle this.
    if (!error.message) {
      return Object.assign({}, error, {
        type: 'unknown-webpack-error',
        shortMessage: message
      })
    }
  }
  return error
}
const formatter = errors => {
  errors = errors.filter(e => e.shortMessage)
  if (errors.length) {
    return errors.map(e => e.shortMessage)
  }
}

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
      additionalTransformers: [transformer],
      additionalFormatters: [formatter]
    }),

    new webpack.ProgressPlugin()
  ]
})

module.exports = webpackConfig
