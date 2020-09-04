const path = require('path')
const config = require('./config')

exports.assetsPath = pathurl => {
  const { assetsSubDirectory } = config[process.env.PACKAGE]
  return path.posix.join(assetsSubDirectory, pathurl)
}
