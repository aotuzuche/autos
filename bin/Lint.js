module.exports = async (options = {}) => {
  const { resolveProjectPath } = require('./lib/utils')
  const { CLIEngine } = require('eslint')
  const cwd = resolveProjectPath()
  const { ignorePattern } = require(resolveProjectPath(
    'appConfig.js'
  )).eslintConfig

  const engine = new CLIEngine({
    ...options,
    cwd,
    extensions: ['.js', '.jsx'],
    ignorePattern
  })

  const formatter = engine.getFormatter('codeframe')

  const report = engine.executeOnFiles(['src'])

  if (options.fix) {
    CLIEngine.outputFixes(report)
  }

  if (report.errorCount || report.warningCount) {
    console.log(formatter(report.results))
    process.exit(1)
  } else {
    console.log('lint 检查通过')
  }
}
