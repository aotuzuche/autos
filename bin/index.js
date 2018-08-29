#!/usr/bin/env node

const chalk = require('chalk')
const latestVersion = require('latest-version')

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


const program = require('commander')
const version = require('../package').version

const q = require('inquirer')
const {init: initQ, create: createQ} = require('./lib/questions')

const mobile = require('./mobile')
const backstage = require('./backstage')

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
    const lVersion = await latestVersion('autos')
    if (lVersion !== version) {
      console.error(
        chalk.red(
          '您的脚手架版本 ' +
          version +
            '\n' +
            '该脚手架最新版本 '+ lVersion +
            '\n' +
            '请升级后再使用'
        )
      )
      return
    }
    q.prompt(initQ).then(answer => {
      // { mobile: true,
      //   new: true,
      //   dir: 'demo',
      //   projectName: 'demoname',
      //   projectType: 'm',
      //   prodPath: 'demo' }
      if (answer.mobile) {
        mobile(answer)
      } else {
        backstage(answer)
      }
    })
  })

// 创建组件或页面
program
  .command('create')
  .alias('c')
  .description('创建组件或页面')
  .action((dir, otherDirs) => {
    console.log(__dirname)
    // q.prompt(createQ).then(answer => {
    //   // { mobile: true,
    //   //   new: true,
    //   //   dir: 'demo',
    //   //   projectName: 'demoname',
    //   //   projectType: 'm',
    //   //   projectBuildDir: 'demo' }
    //   if (answer.mobile) {
    //     mobile(answer)
    //   } else {
    //     backstage(answer)
    //   }
    // })
  })

// 帮助命令
program.on('--help', () => {
  console.log('')
  console.log('  示例:')
  console.log('')
  console.log(chalk.red('    $ autos init'))
  console.log(chalk.red('    $ autos create'))
  console.log(chalk.red('    $ autos -v'))
  console.log(chalk.red('    $ autos -h'))
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
