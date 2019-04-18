const path = require('path')
const APP_CONFIG = require(path.join(process.cwd(), 'appConfig.js'))

// 打包目录的前缀
const prefixPath = APP_CONFIG.prodPathPrefix
  ? APP_CONFIG.prodPathPrefix.replace(/^\//, '')
  : ''

// 打包的出口目录
const prodPath = APP_CONFIG.prodPath
  ? APP_CONFIG.prodPath.replace(/^\//, '')
  : 'dist'

// js和css的资源前缀路径
const assetsPrePath = prefixPath
  ? `/${prefixPath}/${prodPath}/`
  : `/${prodPath}/`

/*
 * {assetsRoot} 资源入口
 * {assetsPublicPath} 资源公共入口
 * {cssAssetsPath} css中提取的图片，字体路径
 * {assetsSubDirectory} 资源子目录
 * {productionSourceMap} source-map
 */

module.exports = {
  APP_CONFIG,
  isSystem: APP_CONFIG.prodPathPrefix === 'system',
  development: {
    port: APP_CONFIG.port,
    assetsPublicPath: '/',
    cssAssetsPath: '/',
    assetsSubDirectory: './',
    productionSourceMap: false
  },
  production: {
    assetsRoot: path.join(process.cwd(), prodPath),
    assetsPublicPath: assetsPrePath,
    cssAssetsPath: assetsPrePath,
    assetsSubDirectory: './',
    productionSourceMap: false
  },
  test: {
    assetsRoot: path.join(process.cwd(), prodPath),
    assetsPublicPath: assetsPrePath,
    cssAssetsPath: assetsPrePath,
    assetsSubDirectory: './',
    productionSourceMap: true
  }
}
