const fs = require('fs-extra')
const DownloadGitRepo = require('./lib/downloadGitRepo')
const ora = require('ora')
const merge = require('deepmerge')
const { resolveAutosPath, resolveProjectPath } = require('./lib/utils')

module.exports = async () => {
  const emptyTarget = value => (Array.isArray(value) ? [] : {})
  const clone = (value, options) => merge(emptyTarget(value), value, options)

  function combineMerge(target, source, options) {
    const destination = target.slice()

    source.forEach(function(e, i) {
      if (typeof destination[i] === 'undefined') {
        const cloneRequested = options.clone !== false
        const shouldClone = cloneRequested && options.isMergeableObject(e)
        destination[i] = shouldClone ? clone(e, options) : e
      } else if (options.isMergeableObject(e)) {
        destination[i] = merge(target[i], e, options)
      } else if (target.indexOf(e) === -1) {
        destination.push(e)
      }
    })
    return destination
  }

  const templateDir = resolveAutosPath('lib/mobile')

  const spinner = ora('更新模板').start()

  await fs.remove(templateDir)
  await fs.ensureDir(templateDir)
  await DownloadGitRepo('shaodahong/atzuche-mobile-template', templateDir)

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

  const newJson = merge(oldPackageJson, newPackageJson, {
    arrayMerge: combineMerge
  })

  fs.outputJson(resolveProjectPath('package.json'), newJson, {
    spaces: 2
  })

  spinner.succeed('升级完成')
}
