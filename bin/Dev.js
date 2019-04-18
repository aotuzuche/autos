module.exports = () => {
  const WebpackDevServer = require('webpack-dev-server')
  const Webpack = require('webpack')
  const { resolveProjectPath } = require('./lib/utils')

  const webpackDevConfig = require('./build/dev')
  const config = require('./build/config')
  const { openBrowser } = require('./lib/openBrowser')
  const address = require('address')
  const chalk = require('chalk')

  const target = config.APP_CONFIG.target
  const {
    port = 3000,
    proxy = {
      '/proxy/*': {
        target: target,
        pathRewrite: {
          '^/proxy/': '/'
        },
        changeOrigin: true,
        secure: false
      }
    }
  } = config.APP_CONFIG

  const options = {
    // clientLogLevel: 'none',
    contentBase: resolveProjectPath('src'),
    watchContentBase: true,
    hot: true,
    host: '0.0.0.0',
    open: true,
    quiet: true,
    disableHostCheck: true,
    historyApiFallback: true,
    port: port,
    overlay: { warnings: false, errors: true },
    proxy: proxy
  }
  WebpackDevServer.addDevServerEntrypoints(webpackDevConfig, options)
  const compiler = Webpack(webpackDevConfig)
  const server = new WebpackDevServer(compiler, options)

  compiler.hooks.done.tap('autos server', stats => {
    if (stats.hasErrors()) {
      return
    }

    console.log()
    console.log(`  App 运行:`)
    console.log(
      `  - 本地: ${chalk.magenta(`http://localhost:${chalk.cyan(port)}/`)}`
    )
    console.log(
      `  - 本地: ${chalk.magenta(
        `http://${address.ip()}:${chalk.cyan(port)}/`
      )}`
    )
    console.log()
    console.log(`  当前环境为开发模式`)
  })

  server.listen(port, '0.0.0.0', () => {
    openBrowser('http://127.0.0.1:' + port)
  })
}
