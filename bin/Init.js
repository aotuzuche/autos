const fs = require('fs-extra')
const q = require('inquirer')
const chalk = require('chalk')

const { resolveProjectPath } = require('./lib/utils')
const generate = require('./lib/generate')
const installDeps = require('./lib/installDeps')
const logger = require('./lib/logger')

module.exports = async (params = {}) => {
  try {
    const inCurrentDir = !params.new
    const targetDir = resolveProjectPath(params.dir || '')

    if (fs.existsSync(targetDir) && !inCurrentDir) {
      const { result } = await q.prompt([
        {
          name: 'result',
          type: 'list',
          message: '目标文件夹已存在，请选择：',
          choices: [
            { name: '覆盖', value: 'overwrite' },
            { name: '合并', value: 'merge' },
            { name: '取消', value: false },
          ],
        },
      ])

      if (!result) {
        return
      }
      if (result === 'overwrite') {
        logger.log()
        logger.spin(`正在删除 ${chalk.red(targetDir)}`)
        await fs.remove(targetDir)
        logger.succeed()
      }
    }
    await fs.ensureDir(targetDir)

    console.log('')
    logger.spin('拉取模板生成项目中')

    await generate(params, targetDir)

    logger.succeed('项目生成啦！！！')
    console.log('')

    console.log(`🌈  ${chalk.white('yarn install')}`)
    console.log('')

    await installDeps(targetDir)

    if (inCurrentDir) {
      console.log('')
      console.log('🍺  快速开始 🍺')
      console.log(`${chalk.green('命令行执行：')} ${chalk.yellow('yarn dev')}`)
    } else {
      console.log('')
      console.log('🍺  快速开始 🍺')
      console.log(`${chalk.green('$')} ${chalk.yellow('cd')} ${chalk.yellow(params.dir)}`)
      console.log(`${chalk.green('$')} ${chalk.yellow('yarn dev')}`)
    }
  } catch (error) {
    console.log(error)
  }
}
