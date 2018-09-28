const webpack = require('webpack')
const config = require('../../build/config')
let webpackConfig = require('../../build/build')
const ora = require('ora')
const chalk = require('chalk')
const rm = require('rimraf')
const path = require('path')
const merge = require('webpack-merge')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin

module.exports = options => {
  if (options.analyzer) {
    webpackConfig = merge(webpackConfig, {
      plugins: [new BundleAnalyzerPlugin()]
    })
  }

  // 开始转菊花
  const spin = ora(chalk.blue(`build for ${process.env.PACKAGE}...`))
  spin.start()

  // 删除构建目录
  // 然后重新构建项目
  rm(path.join(config[process.env.PACKAGE].assetsRoot), err => {
    if (err) throw err

    webpack(webpackConfig, (err, status) => {
      if (err) throw err

      process.stdout.write(
        '\n\n' +
          status.toString({
            colors: true,
            modules: false,
            children: false,
            chunks: false,
            chunkModules: false
          }) +
          '\n\n'
      )

      spin.stop()
      console.log(
        chalk.cyan(
          '  Build for ' + process.env.PACKAGE + ' package complete.\n'
        )
      )
    })
  })
}
