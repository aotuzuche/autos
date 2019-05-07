const path = require('path')
const config = require('./config')

exports.assetsPath = function(pathurl) {
  let assetsSubDirectory = config[process.env.PACKAGE].assetsSubDirectory
  return path.posix.join(assetsSubDirectory, pathurl)
}
