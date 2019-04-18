const Metalsmith = require('metalsmith')
const path = require('path')
const fs = require('fs-extra')
const DownloadGitRepo = require('./downloadGitRepo')
const ejs = require('ejs')

module.exports = async (params, targetDir) => {
  const templateDir = path.join(
    __dirname,
    `../../lib/${params.mobile ? 'mobile' : 'backstage'}`
  )
  await fs.remove(templateDir)
  await fs.ensureDir(templateDir)
  await DownloadGitRepo(
    params.mobile
      ? 'aotuzuche/atzuche-mobile-template'
      : 'aotuzuche/atzuche-backstage-template',
    templateDir
  )

  const metalsmith = Metalsmith(templateDir)
  return new Promise((resolve, reject) => {
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
          if (/yarn\.lock$/.test(fileName)) {
            delete files[fileName]
          }
          try {
            if (/\.gitignore$|appConfig\.js$/.test(fileName)) {
              const t = files[fileName].contents.toString()
              files[fileName].contents = Buffer.from(ejs.compile(t)(params))
            }
          } catch (error) {
            console.log(`\n Template compile Error: ${error}`)
          }
        })
        done()
      })
      .build((err, files) => {
        if (err) return reject(`\n Template build Error: ${err}`)
        resolve()
      })
  })
}
