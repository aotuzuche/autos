#!/usr/bin/env node

const chalk = require('chalk')
const program = require('commander')
const fs = require('fs-extra')
const path = require('path')
const version = require('../package').version
const q = require('inquirer')
const { init: initQ, create: createQ } = require('./lib/questions')
const init = require('./Init')
const backstage = require('./backstage')
const compareVersion = require('./lib/compareVersion')
const create = require('./Create')
const update = require('./Update')

const currentNodeVersion = process.versions.node
const semver = currentNodeVersion.split('.')
const major = semver[0]

// 判断 node 版本
if (major < 8) {
  console.error(
    chalk.red(
      '你的 node 版本 ' +
        currentNodeVersion +
        '.\n' +
        '该脚手架需要 node 8 以上版本，请更新你的 node 版本'
    )
  )
  process.exit(1)
}

// 基本说明
program
  .version(version, '-v, --version')
  .description(chalk.green('凹凸脚手架'))
  .usage('<command> [options]')

// 主命令
program
  .command('init')
  .alias('i')
  .description('初始化项目')
  .action(async (dir, otherDirs) => {
    try {
      await compareVersion()
      const result = await q.prompt(initQ)
      // result
      // { mobile: true,
      //   new: true,
      //   dir: 'demo',
      //   projectName: 'demoname',
      //   projectType: 'm',
      //   prodPath: 'demo' }

      if (result.mobile) {
        init(result)
      } else {
        backstage(result)
      }
    } catch (error) {
      console.log('autos:init--error', error)
    }
  })

// 创建组件或页面
program
  .command('create')
  .alias('c')
  .description('创建组件或页面')
  .action(async (dir, otherDirs) => {
    try {
      await compareVersion()
      const isExist = await fs.pathExists(
        path.join(process.cwd(), 'appConfig.js')
      )
      if (!isExist) {
        console.log('')
        console.log('  请在项目根目录下执行')
        console.log('')
        return
      }
      q.prompt(createQ).then(answer => {
        const options = {
          createName: 'demo',
          createClass: 'component'
        }
        Object.assign(options, answer)
        create(options)
      })
    } catch (error) {
      console.log('autos:create--error', error)
    }
  })

// 升级配置
program
  .command('update')
  .description('升级脚手架')
  .action(async (dir, otherDirs) => {
    try {
      const { result } = await q.prompt([
        {
          type: 'confirm',
          name: 'result',
          message: '是否确定升级?'
        }
      ])
      if (result) {
        await update()
      }
    } catch (error) {
      console.log('autos:update--error', error)
    }
  })

// 本地开发项目
program
  .command('dev')
  .description('本地开发项目')
  .action(async (dir, otherDirs) => {
    try {
      process.env.NODE_ENV = 'development'
      process.env.PACKAGE = 'development'
      require('./Dev')()
    } catch (error) {
      console.log('autos:dev--error', error)
    }
  })

// 构建项目
program
  .command('build')
  .description('构建项目')
  .option('-t, --test', '测试环境')
  .option('--analyzer', '开始分析仪')
  .action(options => {
    const { test, analyzer } = options
    if (test) {
      process.env.NODE_ENV = 'production'
      process.env.PACKAGE = 'test'
    } else {
      process.env.NODE_ENV = 'production'
      process.env.PACKAGE = 'production'
    }

    require('./Build')({
      analyzer
    })
  })

// 帮助命令
program.on('--help', () => {
  console.log('')
  console.log('  示例:')
  console.log('')
  console.log(chalk.yellow('    $ autos init'))
  console.log(chalk.yellow('    $ autos create'))
  console.log(chalk.yellow('    $ autos -v'))
  console.log(chalk.yellow('    $ autos -h'))
  console.log('')
})

// 处理未知命令
program.arguments('<command>').action(cmd => {
  program.outputHelp()
  console.log(`  ` + chalk.red(`未知命令 ${chalk.yellow(cmd)}`))
  console.log()
})

program.parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp()
}
