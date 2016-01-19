'use strict';

const pify = require('pify');
const path = require('path');
const stat = pify(require('fs').stat);
const tag = require('finder-tag');
const readPkgUp = require('read-pkg-up');

const defaultOpts = {
  clear: false,
  dependencyColor: 'blue',
  devDependencyColor: 'yellow'
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
        .then((stats) => stats.isDirectory() && {path: depPath, module: dep});
    });

  const filterDirs = depInfo =>
    Promise.all(depInfo).then(deps => deps.filter(dep => Boolean(dep)));

  const tagDirs = (deps, color) =>
    Promise.all(deps.map(dep =>
      tag(dep.path, color)
        .then(data => {
          data.module = dep.module;
          return data;
        })
    ));

  const tagModules = (deps, color) =>
    filterDirs(getDepInfo(deps))
      .then((deps) => tagDirs(deps, color));

  return (function main() {
    if (process.platform !== 'darwin') {
      return Promise.reject(new Error('only OS X systems are currently supported'));
    }

    if (typeof projectPath !== 'string') {
      return Promise.reject(new TypeError('projectPath path should be a string'));
    }

    opts = Object.assign({}, defaultOpts, opts || {});

    if (opts.clear) {
      opts.dependencyColor = opts.devDependencyColor = 'clear';
    }

    return findRootPackage()
      .then(rootPackage =>
        Promise.all([
          tagModules(rootPackage.dependencies, opts.dependencyColor),
          tagModules(rootPackage.devDependencies, opts.devDependencyColor)
        ]).then(tagged => ({
          dependencies: tagged[0],
          devDependencies: tagged[1]
        }))
      );
  })();
};
