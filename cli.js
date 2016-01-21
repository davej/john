#!/usr/bin/env node
'use strict';

const meow = require('meow');
const john = require('./');
const platform = process.platform.toLowerCase();
const supportedPlatforms = require('./package').os;

(function () {
  if (supportedPlatforms.indexOf(platform) === -1) {
    return console.error(new Error(`${platform} unsupported, supported platforms: ${supportedPlatforms}`));
  }
  const platformLib = require(`./lib/${platform}`);

  const cli = meow(platformLib.cliHelpText(), platformLib.cliOptions);

  john(process.cwd(), cli.flags).then(
    deps => {
      platformLib.cliLog(deps, 'dependencies');
      console.log();
      platformLib.cliLog(deps, 'devDependencies');
    }
  );
})();
