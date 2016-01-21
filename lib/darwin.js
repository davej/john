'use strict';

const tag = require('finder-tag');

const tagDirs = (depType, deps, opts) => {
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

const handleOptions = opts => {
  if (opts.clear) {
    opts.dependencyColor = opts.devDependencyColor = 'clear';
  }
  return opts;
};

exports.handleOptions = handleOptions;
exports.performAction = tagDirs;
