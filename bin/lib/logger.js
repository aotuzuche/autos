const chalk = require('chalk')
const ora = require('ora')

class Logger {
  constructor() {
    this.baseLog = console.log
    this.spinner = ora()
  }

  // eslint-disable-next-line class-methods-use-this
  log(msg) {
    this.baseLog(msg === undefined ? '' : msg)
  }

  error(message) {
    this.log(`⚠️ ${chalk.red(message)}`)
  }

  text(msg) {
    this.spinner.text = msg
  }

  spin(msg) {
    if (this.spinner.isSpinning) {
      this.spinner.text = msg
      return this.spinner
    }
    return this.spinner.start(msg)
  }

  succeed(msg) {
    return this.spinner.succeed(msg)
  }
}

module.exports = new Logger()
