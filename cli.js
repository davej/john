#!/usr/bin/env node
'use strict';
const meow = require('meow');
const john = require('./');
const chalk = require('chalk');

const cli = meow([
  'Usage',
  '  $ john',
  '',
  'Options',
  '  --clear     Clear all tags. [Default: false]',
  '  --deps      Color for dependencies. [Default: blue]',
  '  --dev-deps  Color for devDependencies. [Default: yellow]',
  '',
  'Examples',
  '  $ john',
  '  Tagged 4 dependencies as blue',
  '  Tagged 2 devDependencies as yellow',
  '',
  '  $ john --clear',
  '  Removed 4 tags from dependencies',
  '  Removed 2 tags from devDependencies',
  '',
  '  $ john --deps=purple --dev-deps=gray',
  '  Tagged 4 dependencies as purple',
  '  Tagged 2 devDependencies as gray'
], {
  alias: {
    dep: 'dependencyColor',
    devDep: 'devDependencyColor',
    deps: 'dependencyColor',
    devDeps: 'devDependencyColor'
  }
});

const terminalColor = color =>
  chalk[color] ? chalk[color](color) : color;

const formatDepsLog = (deps, depType) => {
  deps = deps[depType];
  if (!deps.length) {
    return console.log(`No ${depType} found.`);
  }
  const color = deps[0].tag;

  const logRemove = `Removed tags from ${depType}:`;
  const logNormal = `Tagged ${deps.length} ${depType} as ${terminalColor(color)}:`;
  console.log(color === 'clear' ? logRemove : logNormal);

  deps.forEach(dep => console.log(`  - ${dep.module}`));
};

john(process.cwd(), cli.flags).then(
  deps => {
    formatDepsLog(deps, 'dependencies');
    console.log();
    formatDepsLog(deps, 'devDependencies');
  }
);
