const execa = require('execa')
const logWithExit = require('./logWithExit')

module.exports = function checkGitClean() {
  let result

  try {
    result = execa.sync('git', ['status', '--porcelain'], {
      preferLocal: false,
    })

    if (result.stdout && result.stdout.trim()) {
      logWithExit('本地 GIT 有未提交的改动文件，请提交后再试！')
    }
  } catch (error) {
    if (!/not a git repository/i.test(error.message)) {
      logWithExit(error)
    }
  }
}
