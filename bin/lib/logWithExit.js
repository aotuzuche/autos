const chalk = require('chalk')

module.exports = function logWithExit(message) {
  console.log(chalk.red(message))

  process.exit(1)
}
