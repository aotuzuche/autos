const logger = require('./logger')

module.exports = function logWithExit(message) {
  logger.error(message)

  process.exit(1)
}
