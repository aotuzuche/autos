const DownloadGitRepo = require('download-git-repo')

module.exports = async dir => {
  return new Promise((resolve, reject) => {
    DownloadGitRepo('shaodahong/atzuche-mobile-template', dir, err => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}
