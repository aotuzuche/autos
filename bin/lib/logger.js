const chalk = require('chalk')

const log = msg => {
  console.log(msg ? `  ${msg}` : msg)
}

exports.log = msg => {
  log(msg)
}

exports.error = message => {
  log(`⚠️ ${chalk.red(message)}`)
}
