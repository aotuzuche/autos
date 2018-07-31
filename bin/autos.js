#!/usr/bin/env node

const program = require("commander");
const chalk = require("chalk");

program
  .version(require("../package").version, "-v, --version")
  .usage("<command> [options]")

  .command("init [dir]")
  .action(function(dir, otherDirs) {
    console.log(111, dir);
  });

program.on("--help", function() {
  console.log("  Examples:");
  console.log("");
  console.log("    $ custom-help --help");
  console.log("    $ custom-help -h");
  console.log("");
});

program.arguments("<command>").action(cmd => {
  program.outputHelp();
  console.log(`  ` + chalk.red(`未知命令 ${chalk.yellow(cmd)}`));
  console.log();
});

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
