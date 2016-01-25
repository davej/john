const pify = require('pify');
const path = require('path');
const stat = pify(require('fs').stat);

/**
 * Convert object to array (or pass-through is already array)
 * @param  {Array|Object} arr
 * @return {Array} arr
 */
const toArray = arr =>
  Array.isArray(arr) ? arr : Object.keys(arr || {});

/**
 * get path and module name for each dependency
 * @param  {String} modulePath path to `node_modules`
 * @param  {Array|Object} deps
 * @return {Array<Object>} deps
 */
const getDepPaths = (modulePath, deps) =>
  toArray(deps).map(dep => ({
    path: path.join(modulePath, dep),
    module: dep
  }));

/**
 * check if `dep.path` exists and is directory otherwise return false
 * @param  {Array<Object>} deps
 * @return {Promise.<Array.<Object|Boolean>>}
 */
const checkDeps = deps =>
  deps.map(dep =>
    stat(dep.path)
      // Check if dep.path is directory
      .then(stats => stats.isDirectory() && dep)
      // Catch handles dependencies that are not installed
      .catch(() => false)
  );

/**
 * remove dependencies that are falsy
 * @param  {Promise.<Array.<Object|Boolean>>} deps
 * @return {Promise.<Array.<Object>>}
 */
const filterDeps = deps =>
  // Filter out `deps` with value `false`
  Promise.all(deps).then(resolvedDeps => resolvedDeps.filter(dep => Boolean(dep)));

/**
 * get dependency paths and filter out invalid paths
 * @param  {String}  module  Path path to `node_modules` dir
 * @param  {Array|Object} deps
 * @return {Promise.<Array.<Object>>}
 */
const getDeps = (modulePath, deps) =>
  filterDeps(checkDeps(getDepPaths(modulePath, deps)));

module.exports = {
  filterDeps,
  getDeps,
  getDepPaths
};
