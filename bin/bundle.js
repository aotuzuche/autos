const portfinder = require('portfinder')

const getDevConfig = require('./webpack/devConfig')
const getProdConfig = require('./webpack/prodConfig')
const { APP_CONFIG } = require('./config')
const Dev = require('./Dev')
const Build = require('./Build')

module.exports = async function bundle(params) {
  const isDev = process.env.NODE_ENV === 'development'
  const { port: basePort = 3000 } = APP_CONFIG

  portfinder.basePort = basePort
  const port = await portfinder.getPortPromise()

  const options = {
    ...params,
    port,
  }

  const devConfig = await getDevConfig(options)
  const prodConfig = await getProdConfig(options)

  let mergedConfig = isDev ? devConfig : prodConfig

  // 增加 Custom inject 的能力
  if (typeof APP_CONFIG.modify === 'function') {
    mergedConfig = APP_CONFIG.modify(mergedConfig, {
      packageEnv: process.env.PACKAGE,
    })
  }

  if (isDev) {
    return Dev(mergedConfig, options)
  }

  return Build(mergedConfig, options)
}
