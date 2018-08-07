const path = require('path')
const fs = require('fs-extra')
const q = require('inquirer')
const chalk = require('chalk')
const generate = require('./lib/generate')
module.exports = async (params = {}) => {
  const inCurrent = !params.new
  // const targetDir = path.resolve(params.dir || '.')
  const targetDir = path.resolve('demo')
  console.log('fs.existsSync(targetDir)', fs.existsSync(targetDir))

  if (fs.existsSync(targetDir) && !inCurrent) {
    const { result } = await q.prompt([
      {
        name: 'result',
        type: 'list',
        message: '目标文件夹已存在，请选择：',
        choices: [
          { name: '覆盖', value: 'overwrite' },
          { name: '合并', value: 'merge' },
          { name: '去掉', value: false }
        ]
      }
    ])

    if (!result) {
      return
    } else if (result === 'overwrite') {
      console.log(`\n正在删除 ${chalk.red(targetDir)}...`)
      await fs.remove(targetDir)
    }
  }
  await fs.ensureDir(targetDir)

  await generate(params, targetDir)
}
