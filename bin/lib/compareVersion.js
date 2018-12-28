const latestVersion = require('latest-version')
const chalk = require('chalk')

module.exports = async () => {
  const lVersion = await latestVersion('autos')
  const version = require('../../package').version

  return new Promise((resolve, reject) => {
    if (lVersion === version) {
      resolve()
    } else {
      reject(
        chalk.magenta(
          '\n' +
            '本地脚手架版本 V' +
            version +
            '\n' +
            '脚手架最新版本 V' +
            lVersion +
            '\n' +
            '请升级后再使用' +
            '\n' +
            '\n' +
            '升级命令: ' +
            '\n' +
            '$ npm i autos -g'
        )
      )
    }
  })
}
