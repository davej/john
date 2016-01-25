'use strict';

const path = require('path');
const helpers = require('./lib/helpers');
const readPkgUp = require('read-pkg-up');
const platform = process.platform.toLowerCase();
const supportedPlatforms = require('./package').os;

const defaultOpts = {
  clear: false,
  // OSX options
  dependencyColor: 'blue',
  devDependencyColor: 'yellow',
  // Windows options
  dependencyHidden: false,
  devDependencyHidden: false
};

module.exports = (projectPath, opts) => {
  let modulesPath;
  const findRootPackage = () =>
    readPkgUp({cwd: projectPath}).then(pkg => {
      if (!pkg.pkg) {
        return Promise.reject(new Error(`couldn't find package.json in ${projectPath}`));
      }
      projectPath = path.dirname(pkg.path);
      modulesPath = path.join(projectPath, 'node_modules');
      return pkg.pkg;
    });

  return (function main() {
    if (supportedPlatforms.indexOf(platform) === -1) {
      return Promise.reject(new Error(`${platform} unsupported, supported platforms: ${supportedPlatforms}`));
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
              helpers.getDeps(modulesPath, rootPackage.dependencies),
              helpers.getDeps(modulesPath, rootPackage.devDependencies)
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
