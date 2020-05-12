module.exports = async () => {
  const WebpackDevServer = require('webpack-dev-server')
  const Webpack = require('webpack')
  // const { resolveProjectPath } = require('./lib/utils')

  const webpackDevConfig = require('./build/dev')
  const config = require('./build/config')
  const { openBrowser } = require('./lib/openBrowser')
  const address = require('address')
  const chalk = require('chalk')
  const portfinder = require('portfinder')
  const path = require('path')
  const fs = require('fs')

  function mayProxy(pathname) {
    const maybePublicPath = path.resolve(
      config[process.env.PACKAGE].assetsPublicPath,
      pathname.slice(1),
    )
    const isPublicFileRequest = fs.existsSync(maybePublicPath)
    const isWdsEndpointRequest = pathname.startsWith('/sockjs-node') // used by webpackHotDevClient
    return !(isPublicFileRequest || isWdsEndpointRequest)
  }

  const { target, autoLogin } = config.APP_CONFIG
  const host = '0.0.0.0'

  let {
    port = 3000,
    // eslint-disable-next-line prefer-const
    proxy = [
      {
        target,
        // 兼容下老的
        pathRewrite: {
          '^/proxy/': '/',
        },
        secure: false,
        changeOrigin: true,
        ws: true,
        xfwd: true,
        context: (pathname, req) => {
          if (autoLogin && /^\/system\/login\/?$/.test(pathname)) {
            return true
          }
          return (
            req.method !== 'GET' ||
            (mayProxy(pathname) &&
              req.headers.accept &&
              req.headers.accept.indexOf('text/html') === -1)
          )
        },
        logLevel: 'silent',
      },
    ],
  } = config.APP_CONFIG

  // dynamic get port
  portfinder.basePort = port
  port = await portfinder.getPortPromise()

  // add hot update
  webpackDevConfig.entry.unshift(require.resolve('webpack/hot/dev-server'))
  webpackDevConfig.entry.unshift(
    `${require.resolve('webpack-dev-server/client')}?http://${host}:${port}/sockjs-node`,
  )

  const options = {
    // clientLogLevel: 'silent',
    // contentBase: config[process.env.PACKAGE].assetsRoot,
    // watchContentBase: true,
    hot: true,
    host,
    quiet: true,
    disableHostCheck: true,
    historyApiFallback: true,
    port,
    overlay: { warnings: false, errors: true },
    proxy,
  }
  // WebpackDevServer.addDevServerEntrypoints(webpackDevConfig, options)
  const compiler = Webpack(webpackDevConfig)
  const server = new WebpackDevServer(compiler, options)

  let isFirstCompile = true

  compiler.hooks.done.tap('autos dev', stats => {
    if (stats.hasErrors()) {
      return
    }

    console.log()
    console.log('  App 运行:')
    console.log(`  - 本地: ${chalk.magenta(`http://localhost:${chalk.cyan(port)}/`)}`)
    console.log(`  - 局域网: ${chalk.magenta(`http://${address.ip()}:${chalk.cyan(port)}/`)}`)
    console.log()
    console.log('  当前环境为开发模式')

    if (isFirstCompile) {
      isFirstCompile = false
      openBrowser(`http://localhost:${port}`)
    }
  })

  server.listen(port, host, err => {
    if (err) {
      console.error(err)
    }
  })
}
