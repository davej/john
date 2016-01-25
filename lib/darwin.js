'use strict';

const tag = require('finder-tag');
const chalk = require('chalk');

/**
 * Set colors to `clear` if the clear option is Set
 * @param  {Object} opts
 * @return {Object} opts
 */
const handleOptions = opts => {
  if (opts.clear) {
    opts.dependencyColor = opts.devDependencyColor = 'clear';
  }
  return opts;
};

/**
 * Tag dependency folders with colors
 * @param  {String} depType 'dependencies' or 'devDependencies'
 * @param  {Array.<Object>} deps
 * @param  {Object} opts
 * @return {Promise.<Array.<Object>>}
 */
const performAction = (depType, deps, opts) => {
  // tag dependency directories with corresponding color
  const depTypeSingular = `${depType.slice(0, -3)}y`;
  const color = opts[`${depTypeSingular}Color`];

  return Promise.all(deps.map(dep =>
    tag(dep.path, color)
      .then(data => {
        data.module = dep.module;
        return data;
      })
  ));
};

/**
 * CLI output to the user
 * @param  {Array.<Object>} deps
 * @param  {String} depType 'dependencies' or 'devDependencies'
 */
const cliLog = (deps, depType) => {
  const terminalColor = color => chalk[color] ? chalk[color](color) : color;

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

/**
 * Output the CLI helper text for OS X
 */
const cliHelpText = () =>
  [
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
  ];

/**
 * Defines the OS X CLI options
 */
const cliOptions = () =>
  ({
    alias: {
      dep: 'dependencyColor',
      devDep: 'devDependencyColor',
      deps: 'dependencyColor',
      devDeps: 'devDependencyColor'
    }
  });

module.exports = {
  handleOptions,
  performAction,
  cliHelpText,
  cliOptions,
  cliLog
};
