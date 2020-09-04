const fs = require('fs')
const hash = require('hash-sum')
const eslintLoaderVersion = require('eslint-loader/package.json').version
const { resolveProjectPath } = require('./utils')

const eslintVersion = require(resolveProjectPath('node_modules/eslint/package.json')).version

module.exports = () => {
  const filePath = resolveProjectPath('package.json')

  const configFiles = {
    'eslint-loader': eslintLoaderVersion,
    eslint: eslintVersion,
    content: fs.readFileSync(filePath, 'utf-8'),
  }
  return hash(configFiles)
}
