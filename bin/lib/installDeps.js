const execa = require('execa')
const readline = require('readline')
const chalk = require('chalk')
const { resolveProjectPath } = require('./utils')

function toStartOfLine(stream) {
  if (!chalk.supportsColor) {
    stream.write('\r')
    return
  }
  readline.cursorTo(stream, 0)
}

function renderProgressBar(curr, total) {
  const ratio = Math.min(Math.max(curr / total, 0), 1)
  const bar = ` ${curr}/${total}`
  const availableSpace = Math.max(0, process.stderr.columns - bar.length - 3)
  const width = Math.min(total, availableSpace)
  const completeLength = Math.round(width * ratio)
  const complete = '#'.repeat(completeLength)
  const incomplete = '-'.repeat(width - completeLength)
  toStartOfLine(process.stderr)
  process.stderr.write(`[${complete}${incomplete}]${bar}`)
}

module.exports = targetDir =>
  new Promise((resolve, reject) => {
    const child = execa('yarn', [], {
      cwd: targetDir || resolveProjectPath(),
      stdio: ['inherit', 'inherit', 'pipe'],
      shell: true,
    })

    child.stderr.on('data', buf => {
      const str = buf.toString()
      if (/warning/.test(str)) {
        return
      }

      // progress bar
      const progressBarMatch = str.match(/\[.*\] (\d+)\/(\d+)/)
      if (progressBarMatch) {
        renderProgressBar(progressBarMatch[1], progressBarMatch[2])
        return
      }

      process.stderr.write(buf)
    })

    child.on('exit', (code, signal) => {
      if (code || signal) {
        console.log('')
        console.log('yarn install 失败')
        reject(code || signal)
      }
      resolve()
    })
  })
