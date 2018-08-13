const path = require('path')
const fs = require('fs-extra')
const q = require('inquirer')
const chalk = require('chalk')
const shell = require('shelljs')
const ora = require('ora')

const generate = require('./lib/generate')

module.exports = async (params = {}) => {
  const inCurrent = !params.new
  const targetDir = path.resolve(params.dir || '.')

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
      console.log(`\n正在删除 ${chalk.red(targetDir)}...\n`)
      await fs.remove(targetDir)
    }
  }
  await fs.ensureDir(targetDir)

  const spinner = ora('开始生成模板').start()

  await generate(params, targetDir)

  spinner.color = 'yellow'
  spinner.text = '安装项目依赖'

  if (!inCurrent) {
    shell.cd(targetDir)
  }

  const child = shell.exec('yarn', {
    silent: true,
    async: true
  })

  child.stdout.on('close', function(data) {
    spinner.succeed('完成安装')
  })

}
