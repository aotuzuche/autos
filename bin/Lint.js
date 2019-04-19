module.exports = async (options = {}) => {
  const { resolveProjectPath } = require('./lib/utils')
  const { CLIEngine } =
    require(resolveProjectPath('node_modules/eslint')) || require('eslint')

  const cwd = resolveProjectPath()

  const engine = new CLIEngine({
    ...options,
    cwd,
    extensions: ['.js', '.jsx']
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
