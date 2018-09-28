const Metalsmith = require('metalsmith')
const path = require('path')
const fs = require('fs-extra')
const ejs = require('ejs')
const q = require('inquirer')
const DownloadGitRepo = require('./downloadGitRepo')
const { capitalize } = require('./utils.js')

module.exports = async options => {
  const { createName, createClass } = options
  const templateDir = path.join(__dirname, '../../lib/create')
  const targetDir = path.join(
    process.cwd(),
    `/src/${createClass}s/${createName}`
  )
  await fs.remove(templateDir)
  await fs.ensureDir(templateDir)
  await DownloadGitRepo('shaodahong/atzuche-create-template', templateDir)

  const isExist = await fs.pathExists(targetDir)

  if (isExist) {
    const answer = await q.prompt({
      type: 'confirm',
      name: 'isContinue',
      default: false,
      message: '目录已存在是否继续?'
    })

    if (!answer) {
      return
    }
  }

  const metalsmith = Metalsmith(path.join(templateDir, 'template', createClass))
  return new Promise((resolve, reject) => {
    // 首字母大写
    options.createName = capitalize(options.createName)
    metalsmith
      .metadata({
        destDirName: '/',
        inPlace: targetDir,
        noEscape: true
      })
      .clean(false)
      .source('.')
      .destination(targetDir)
      .use((files, metalsmith, done) => {
        Object.keys(files).forEach(fileName => {
          const t = files[fileName].contents.toString()
          files[fileName].contents = Buffer.from(ejs.compile(t)(options))
        })
        done()
      })
      .build((err, files) => {
        if (err) return reject(`\n Template build Error: ${err}`)
        resolve()
      })
  })
}
