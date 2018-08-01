#!/usr/bin/env node

const chalk = require('chalk')

const currentNodeVersion = process.versions.node;
const semver = currentNodeVersion.split('.');
const major = semver[0];

// if (major < 8) {
  console.error(
    chalk.red(
      '你的 node 版本 ' +
        currentNodeVersion +
        '.\n' +
        '该脚手架需要 node 8 以上版本，请更新你的 node 版本'
    )
  );
  process.exit(1);
// }

const program = require('commander')

const q = require('inquirer')
const questions = require('./lib/questions')

const mobile = require('./mobile')
const backstage = require('./backstage')

program
  .version(require('../package').version, '-v, --version')
  .description(chalk.green('凹凸脚手架'))
  .usage('<command> [options]')

program
  .command('init')
  .alias('i')
  .description('初始化项目')
  .action((dir, otherDirs) => {
    q.prompt(questions).then(answer => {
      if (answer.mobile) {
        mobile(answer)
      } else {
        backstage(answer)
      }
    })
  })

program.on('--help', () => {
  console.log('')
  console.log('  示例:')
  console.log('')
  console.log(chalk.red('    $ autos init'))
  console.log(chalk.red('    $ autos -v'))
  console.log(chalk.red('    $ autos -h'))
  console.log('')
})

program.arguments('<command>').action(cmd => {
  program.outputHelp()
  console.log(`  ` + chalk.red(`未知命令 ${chalk.yellow(cmd)}`))
  console.log()
})

program.parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp()
}
