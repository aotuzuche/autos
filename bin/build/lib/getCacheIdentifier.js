module.exports = () => {
  const { resolveProjectPath } = require('../../lib/utils')
  const fs = require('fs')
  const hash = require('hash-sum')
  const filePath = resolveProjectPath('package.json')

  const configFiles = {
    'eslint-loader': require('eslint-loader/package.json').version,
    eslint: require('eslint/package.json').version,
    content: fs.readFileSync(filePath, 'utf-8')
  }
  return hash(configFiles)
}
