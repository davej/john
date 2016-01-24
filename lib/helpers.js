const pify = require('pify');
const path = require('path');
const stat = pify(require('fs').stat);

const arrayify = arr => Array.isArray(arr) ? arr : Object.keys(arr || {});

const getDepPaths = (modulePath, deps) =>
  arrayify(deps).map(dep => ({
    path: path.join(modulePath, dep),
    module: dep
  }));

const checkDeps = deps =>
  deps.map(dep =>
    stat(dep.path)
      // Check if dep.path is directory
      .then(stats => stats.isDirectory() && dep)
      // Catch handles dependencies that are not installed
      .catch(() => false)
  );

const filterDeps = depInfo =>
  // Filter out `deps` with value `false`
  Promise.all(depInfo).then(deps => deps.filter(dep => Boolean(dep)));

const getDeps = (modulePath, deps) =>
  filterDeps(checkDeps(getDepPaths(modulePath, deps)));

module.exports = {
  filterDeps,
  getDeps,
  getDepPaths
};
