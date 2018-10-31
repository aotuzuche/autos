
const config = require('./config')
const utils = require('./utils')
const webpack = require('webpack')
const merge = require('webpack-merge')

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

    new webpack.ProgressPlugin()
  ]
})

module.exports = webpackConfig
