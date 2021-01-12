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

  const { target, autoLogin, mfe } = config.APP_CONFIG
  const isMfe = !!mfe

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

  const options = {
    host,
    firewall: false,
    historyApiFallback: true,
    port,
    overlay: { warnings: false, errors: true },
    proxy,
    injectClient: true,
    injectHot: true,
    hot: !isMfe,
  }
  // WebpackDevServer.addDevServerEntrypoints(webpackDevConfig, options)
  const compiler = Webpack(webpackConfig)
  const server = new WebpackDevServer(compiler, options)

  ;['SIGINT', 'SIGTERM'].forEach(signal => {
    process.on(signal, () => {
      server.close(() => {
        compiler.close(() => {
          process.exit(0)
        })
      })
    })
  })

  return new Promise((resolve, reject) => {
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

      resolve(server)
    })

    server.listen(port, host, err => {
      if (err) {
        console.error(err)
        reject(err)
      }
    })
  })
}
