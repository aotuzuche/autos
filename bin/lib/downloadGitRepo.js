const DownloadGitRepo = require('download-git-repo')

module.exports = async (git, dir) => new Promise((resolve, reject) => {
  DownloadGitRepo(git, dir, err => {
    if (err) {
      reject(err)
    } else {
      resolve()
    }
  })
})
