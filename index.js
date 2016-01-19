'use strict';

const pify = require('pify');
const path = require('path');
const stat = pify(require('fs').stat);
const tag = require('finder-tag');

module.exports = (root, opts) => {
  if (process.platform !== 'darwin') {
    return Promise.reject(new Error('only OS X systems are currently supported'));
  }

  if (typeof root !== 'string') {
    return Promise.reject(new TypeError('root path should be a string'));
  }

  const defaultOpts = {
    clear: false,
    dependencyColor: 'blue',
    devDependencyColor: 'yellow'
  };
  opts = Object.assign(defaultOpts, opts || {});
  if (opts.clear) {
    opts.dependencyColor = opts.devDependencyColor = 'clear';
  }

  const findRootPackage = tryParent => {
    if (tryParent) {
      root = path.join(root, '../');
    }
    const rootPackageFile = path.join(root, 'package.json');
    return stat(rootPackageFile).then(
      () => require(rootPackageFile),
      (err) => {
        if (!tryParent) {
          return findRootPackage(true);
        }
        err.message = `${err}. john should be run in project root.`;
        return Promise.reject(err);
      }
    );
  };

  const getDepInfo = deps =>
    Object.keys(deps || {}).map(dep => {
      const depPath = path.join(root, 'node_modules', dep);
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
};
