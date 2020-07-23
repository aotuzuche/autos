const fs = require('fs-extra')
const DownloadGitRepo = require('./lib/downloadGitRepo')
const deepMerge = require('./lib/deepMerge')
const { resolveAutosPath, resolveProjectPath } = require('./lib/utils')
const installDeps = require('./lib/installDeps')
const logger = require('./lib/logger')

module.exports = async () => {
  const templateDir = resolveAutosPath('lib/backstage')

  logger.spin('更新模板')

  await fs.remove(templateDir)
  await fs.ensureDir(templateDir)
  await DownloadGitRepo('aotuzuche/atzuche-backstage-template', templateDir)

  logger.spin('合并 package.json')

  const newPackageJson = require(resolveAutosPath('lib/backstage/package.json'))
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

  await installDeps()

  logger.succeed('升级完成')
}
