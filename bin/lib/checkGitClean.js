const execa = require('execa')
const logWithExit = require('./logWithExit')

module.exports = function checkGitClean() {
  let result

  try {
    result = execa.sync('git', ['status', '--porcelain'], {
      preferLocal: false,
    })
  } catch (error) {
    if (!/not a git repository/.test(error.message)) {
      return logWithExit(error)
    }
  }

  if (result.stdout && result.stdout.trim()) {
    logWithExit('本地有改动的文件未提交！！！')
  }
}
