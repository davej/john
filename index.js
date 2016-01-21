'use strict';

const pify = require('pify');
const path = require('path');
const stat = pify(require('fs').stat);
const readPkgUp = require('read-pkg-up');
const platform = process.platform.toLowerCase();
const supportedPlatforms = require('./package').os;

const defaultOpts = {
  clear: false,
  // osx-only options
  dependencyColor: 'blue',
  devDependencyColor: 'yellow'
  // windows-only options
  // ...
};

module.exports = (projectPath, opts) => {
  const findRootPackage = () =>
    readPkgUp({cwd: projectPath}).then(pkg => {
      if (!pkg.pkg) {
        return Promise.reject(new Error(`couldn't find package.json in ${projectPath}`));
      }
      projectPath = path.dirname(pkg.path);
      return pkg.pkg;
    });

  const getDepInfo = deps =>
    Object.keys(deps || {}).map(dep => {
      const depPath = path.join(projectPath, 'node_modules', dep);
      return stat(depPath)
        .then(stats => stats.isDirectory() && {path: depPath, module: dep});
    });

  const filterDirs = depInfo =>
    Promise.all(depInfo).then(deps => deps.filter(dep => Boolean(dep)));

  const getDeps = deps => filterDirs(getDepInfo(deps));

  return (function main() {
    if (supportedPlatforms.indexOf(platform) === -1) {
      return Promise.reject(new Error('only OS X systems are currently supported'));
    }

    const platformLib = require(`./lib/${platform}`);

    if (typeof projectPath !== 'string') {
      return Promise.reject(new TypeError('projectPath path should be a string'));
    }

    opts = Object.assign({}, defaultOpts, opts || {});

    if (typeof platformLib.handleOptions === 'function') {
      opts = platformLib.handleOptions(opts);
    }

    if (typeof platformLib.performPreAction !== 'function') {
      platformLib.performPreAction = () => Promise.resolve();
    }

    return findRootPackage()
      .then(rootPackage =>
        platformLib.performPreAction(projectPath, opts)
          .then(() =>
            Promise.all([
              getDeps(rootPackage.dependencies),
              getDeps(rootPackage.devDependencies)
            ]).then(deps =>
              Promise.all([
                platformLib.performAction('dependencies', deps[0], opts),
                platformLib.performAction('devDependencies', deps[1], opts)
              ])
            ).then(affectedDeps => ({
              dependencies: affectedDeps[0],
              devDependencies: affectedDeps[1]
            }))
          )
      );
  })();
};
