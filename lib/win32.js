'use strict';

const pify = require('pify');
const fs = require('fs');
const path = require('path');
const readdir = pify(fs.readdir);
const stat = pify(fs.stat);
const writeFile = pify(fs.writeFile);
const fswin = require('fswin');

/**
 * Modify options object as needed for Windows
 * @param opts Object
 * @returns Object
 */
const handleOptions = opts => {
  // Convert any CLI params to boolean
  Object.keys(opts).forEach((key) => {
    const val = opts[key];
    if (typeof val === 'string') {
      opts[key] = opts[key] === 'true';
    }
  });

  if (opts.clear) {
    opts.dependencyHidden = opts.devDependencyHidden = false;
  }
  return opts;
};

/**
 * This hides all the dependencies first and writes the info file
 * @param projectPath String
 * @param opts Object
 * @returns {Promise}
 */
const performPreAction = (projectPath, opts) => {
  const modules = path.join(projectPath, 'node_modules');
  const hidden = typeof opts.clear === 'boolean' ? !opts.clear : true;

  const writeTextFile = writeFile(
    path.join(modules, 'modules_hidden.txt'),
    'You\'ve hidden modules with `john` - https://github.com/davej/john',
    {flags: 'w'}
  ).catch(
    (err) => new Error('Failed to write info file', err)
  );

  return writeTextFile.then(() => readdir(modules).then((files) => Promise.all(files.map((dep) => {
    const depPath = path.join(modules, dep);

    return stat(depPath).then(
      // Return false or the path if item is a directory
      (stats) => stats.isDirectory() && depPath
    );
  })).then((files) => {
    // Filter out files
    const dirs = files.filter((file) => file);

    // Hide all the directories
    return Promise.all(dirs.map(
      (dir) => new Promise((resolve, reject) => {
        const success = fswin.setAttributesSync(dir, {IS_HIDDEN: hidden});
        return success ? resolve(dir) : reject('Failed to hide dir ' + dir);
      })
    ));
  })));
};

/**
 * Determine whether to hide or show the passed in type of dependencies
 * @param depType String
 * @param deps Object
 * @param opts Object
 * @returns {Promise}
 */
const performAction = (depType, deps, opts) => {
  const depTypeSingular = `${depType.slice(0, -3)}y`;
  const hide = opts[`${depTypeSingular}Hidden`];

  return Promise.all(deps.map(dep =>
    new Promise((resolve, reject) => {
      const success = fswin.setAttributesSync(dep.path, {IS_HIDDEN: hide});
      return success ? resolve(Object.assign(dep, {hidden: hide})) : reject('Failed to modify dir ' + dep.path);
    })
  ));
};

/**
 * CLI output to the user
 * @param deps Object
 * @param depType String
 */
const cliLog = (deps, depType) => {
  deps = deps[depType];
  if (deps.length) {
    const hidden = deps[0].hidden;
    const logShow = `Unhid ${depType}:`;
    const logHide = `Hid ${deps.length} ${depType}:`;
    console.log(hidden ? logHide : logShow);

    deps.forEach(dep => console.log(`  - ${dep.module}`));
  } else {
    console.log(`No ${depType} found.`);
  }
};

/**
 * Output the helper text for using john in Windows
 */
const cliHelpText = () =>
  [
    'Usage',
    '  > john',
    '',
    'Options',
    '  --clear     Clear all hidden dependencies. [Default: false]',
    '  --deps      Hide dependencies. [Default: false]',
    '  --dev-deps  Hide devDependencies. [Default: false]',
    '',
    'Examples',
    '  $ john',
    '  Hid 4 dependencies',
    '',
    '  $ john --clear',
    '  Unhid 4 dependencies'
  ];

/**
 * Defines the Windows options for john
 */
const cliOptions = () =>
  ({
    alias: {
      dep: 'dependencyHidden',
      devDep: 'devDependencyHidden',
      deps: 'dependencyHidden',
      devDeps: 'devDependencyHidden'
    }
  });

module.exports = {
  handleOptions,
  performPreAction,
  performAction,
  cliHelpText,
  cliOptions,
  cliLog
};
