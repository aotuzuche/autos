const Metalsmith = require('metalsmith')
const path = require('path')
const fs = require('fs-extra')
const ejs = require('ejs')
const DownloadGitRepo = require('./downloadGitRepo')

module.exports = async (params, targetDir) => {
  try {
    const templateDir = path.join(__dirname, '../../lib/backstage')
    await fs.remove(templateDir)
    await DownloadGitRepo('aotuzuche/atzuche-backstage-template', templateDir)

    const metalsmith = Metalsmith(templateDir)
    return new Promise((resolve, reject) => {
      metalsmith
        .metadata({
          destDirName: '/',
          inPlace: targetDir,
          noEscape: true,
        })
        .clean(false)
        .source('.')
        .destination(targetDir)
        .use((files, ms, done) => {
          Object.keys(files).forEach(fileName => {
            if (/\.github/.test(fileName)) {
              delete files[fileName]
            }
            try {
              if (/\.gitignore$|appConfig\.js$|routes\/index.tsx$/.test(fileName)) {
                const t = files[fileName].contents.toString()
                files[fileName].contents = Buffer.from(ejs.compile(t)(params))
              }
            } catch (error) {
              console.log(`\n Template compile Error: ${error}`)
            }
          })
          done()
        })
        .build(err => {
          if (err) return reject(`\n Template build Error: ${err}`)
          resolve()
        })
    })
  } catch (error) {
    console.error('Init->Generate:', 'error')
  }
}
