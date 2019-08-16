const fs = require('fs-extra')
const ora = require('ora')
const DownloadGitRepo = require('./lib/downloadGitRepo')
const deepMerge = require('./lib/deepMerge')
const { resolveAutosPath, resolveProjectPath } = require('./lib/utils')

module.exports = async () => {
  const templateDir = resolveAutosPath('lib/mobile')

  const spinner = ora('更新模板').start()

  await fs.remove(templateDir)
  await fs.ensureDir(templateDir)
  await DownloadGitRepo('aotuzuche/atzuche-mobile-template', templateDir)

  spinner.color = 'yellow'
  spinner.text = '合并 package.json'

  const newPackageJson = require(resolveAutosPath('lib/mobile/package.json'))
  const oldPackageJson = require(resolveProjectPath('package.json'))

  // 删除一些不需要 merge 的配置
  delete newPackageJson.name
  delete newPackageJson.version
  delete newPackageJson.author
  delete newPackageJson.description
  delete newPackageJson.main

  const newJson = deepMerge(oldPackageJson, newPackageJson)

  fs.outputJson(resolveProjectPath('package.json'), newJson, {
    spaces: 2,
  })

  spinner.succeed('升级完成')
}
