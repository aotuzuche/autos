const Metalsmith = require('metalsmith')
const Handlebars = require('handlebars')
const path = require('path')
module.exports = async (params, targetDir) => {
  const metalsmith = Metalsmith(path.join(process.cwd(), '/lib/mobile'))
  console.log(1, params, targetDir)
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
        if (/\.js$|\.jsx$|\.json$|\.md$/.test(fileName)) {
          console.log('fileName', fileName)

          const t = files[fileName].contents.toString()
          files[fileName].contents = new Buffer(Handlebars.compile(t)(params))
        }
      })
      done()
    })
    .build((err, files) => {
      console.log(err, files)
    })
}
