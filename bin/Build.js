module.exports = options => {
  const webpack = require('webpack')
  const config = require('./build/config')
  let webpackConfig = require('./build/build')
  const ora = require('ora')
  const chalk = require('chalk')
  const rm = require('rimraf')
  const path = require('path')
  const merge = require('webpack-merge')
  const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
  const formatStats = require('./lib/formatStats')

  const { APP_CONFIG } = config

  const setting = {
    test: '测试环境',
    production: '生产环境',
  }
  if (options.analyzer) {
    webpackConfig = merge(webpackConfig, {
      plugins: [new BundleAnalyzerPlugin()],
    })
  }

  // 开始转菊花
  console.log()
  const spin = ora(`开始构建 -> ${chalk.cyan(setting[process.env.PACKAGE])}...`)
  spin.start()

  // 删除构建目录
  // 然后重新构建项目
  rm(path.join(config[process.env.PACKAGE].assetsRoot), err => {
    if (err) {
      return console.log(err)
    }

    webpack(webpackConfig, (err, stats) => {
      spin.stop()
      if (err) {
        return console.log(err)
      }

      if (stats.hasErrors()) {
        return console.log('构建出现错误')
      }

      console.log()
      console.log(formatStats(stats, APP_CONFIG.prodPath))
      console.log(`  构建完成, 可以去构建目录 ${chalk.cyan(APP_CONFIG.prodPath)} 查看`)
    })
  })
}
