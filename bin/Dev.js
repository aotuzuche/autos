const WebpackDevServer = require('webpack-dev-server')
const Webpack = require('webpack')

const webpackDevConfig = require('../build/dev')
const config = require('../build/config')
const opn = require('opn')

module.exports = () => {
  const options = {
    progress: true,
    contentBase: __dirname,
    hot: true,
    host: 'localhost',
    open: true,
    inline: true,
    quiet: true,
    disableHostCheck: true,
    noInfo: false,
    port: config.APP_CONFIG.port,
    proxy: {
      '/proxy/*': {
        target: config.APP_CONFIG.target,
        pathRewrite: {
          '^/proxy/': '/'
        },
        changeOrigin: true,
        secure: false
      }
    }
  }
  WebpackDevServer.addDevServerEntrypoints(webpackDevConfig, options)
  const server = new WebpackDevServer(Webpack(webpackDevConfig), options)

  server.listen(config.APP_CONFIG.port, 'localhost', () => {
    opn('http://localhost:' + config.APP_CONFIG.port)
  })
}
