const Metalsmith = require('metalsmith')
const Handlebars = require('handlebars')
const path = require('path')
const fs = require('fs-extra')
const DownloadGitRepo = require('./downloadGitRepo')

module.exports = async (params, targetDir) => {
  const templateDir = path.join(process.cwd(), '/lib/mobile')
  await fs.remove(templateDir)
  await fs.ensureDir(templateDir)
  await DownloadGitRepo(templateDir)

  const metalsmith = Metalsmith(templateDir)
  return new Promise((resole, reject) => {
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
          try {
            if (
              /\.gitignore$|appConfig\.js$/.test(
                fileName
              )
            ) {
              const t = files[fileName].contents.toString()
              files[fileName].contents = new Buffer(
                Handlebars.compile(t)(params)
              )
            }
          } catch (error) {
            console.log(`\n Template compile Error: ${error}`)
          }
        })
        done()
      })
      .build((err, files) => {
        if (err) {
          reject(`\n Template build Error: ${err}`)
        }
        resole()
      })
  })
}
