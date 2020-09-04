const WebpackDevServer = require('webpack-dev-server')
const Webpack = require('webpack')
const openBrowser = require('react-dev-utils/openBrowser')
const address = require('address')
const chalk = require('chalk')
const path = require('path')
const fs = require('fs')

const config = require('./config')

module.exports = async (webpackConfig, { port }) => {
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

  // add hot update
  webpackConfig.entry.unshift(require.resolve('webpack/hot/dev-server'))
  webpackConfig.entry.unshift(
    `${require.resolve('webpack-dev-server/client')}?http://${host}:${port}/sockjs-node`,
  )

  const options = {
    clientLogLevel: 'silent',
    hot: true,
    host,
    disableHostCheck: true,
    historyApiFallback: true,
    port,
    overlay: { warnings: false, errors: true },
    proxy,
    noInfo: true,
  }
  // WebpackDevServer.addDevServerEntrypoints(webpackDevConfig, options)
  const compiler = Webpack(webpackConfig)
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
