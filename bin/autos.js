#!/usr/bin/env node

const program = require('commander')
const chalk = require('chalk')

program
  .version(require('../package').version, '-v, --version')
  .description('凹凸脚手架')
  .usage('<command> [options]')

program
  .command('init [dir]')
  .alias('i')
  .description('初始化项目')
  .action(function(dir, otherDirs) {
    console.log(111, dir)
  })

program.on('--help', function() {
  console.log('')
  console.log('  示例:')
  console.log('')
  console.log('    $ custom-help --help')
  console.log('    $ custom-help -h')
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
