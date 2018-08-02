const Metalsmith = require("metalsmith")
const Handlebars = require("handlebars")
const path = require("path")

const metalsmith = Metalsmith(path.join(process.cwd(), "/lib/mobile"))

metalsmith
  .metadata({
    destDirName: 'demo',
    inPlace: process.cwd(),
    noEscape: true
  })
  .clean(false)
  .source(".")
  .destination(process.cwd())
  .build((err, files) => {
    console.log(err, files)
  })

// module.exports = async params => {

// }
