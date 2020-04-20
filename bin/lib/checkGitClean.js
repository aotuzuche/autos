const execa = require('execa')
const logWithExit = require('./logWithExit')

module.exports = function checkGitClean() {
  const result = execa.sync('git', ['status', '--porcelain'], {
    preferLocal: false,
  })

  if (result.stdout && result.stdout.trim()) {
    logWithExit('本地有改动的文件未提交！！！')
  }
}
