# john [![Build Status](https://travis-ci.org/davej/john.svg?branch=master)](https://travis-ci.org/davej/john)

> Make npm3's flat dependencies easier to find and sort on OS X

npm3 has flat dependency trees, this is a good thing for many reasons.
Unfortunately, this means your `node_modules` folder might contain hundreds (or thousands?)
of modules and that makes it difficult to quickly debug/hack on issues with top-level dependencies.

John is your man. He puts color tags on your top-level dependencies and devDependencies,
this makes your top-level dependencies easier to find and sort.

*Note: This project is currently OS X only, but if you have ideas on how something similar could be implemented other platforms then create an issue.*

<p align="center"><img src ="https://cdn.rawgit.com/davej/john/a2b79a0ffc8da296d382bd99b29977195cb3976c/usage.gif" /></p>

## CLI

```
$ npm install --global john
```

```
$ john --help

  Make npm3's flat dependencies easier to find and sort on OS X

  Usage
    $ john

  Options
    --clear     Clear all tags. [Default: false]
    --deps      Color for dependencies. [Default: blue]
    --dev-deps  Color for devDependencies. [Default: yellow]

  Available Colors:
    gray, green, purple, blue, yellow, red, orange, clear.

  Examples
    $ john
    Tagged 4 dependencies as blue
    Tagged 2 devDependencies as yellow

    $ john --clear
    Removed 4 tags from dependencies
    Removed 2 tags from devDependencies

    $ john --deps=purple --dev-deps=gray
    Tagged 4 dependencies as purple
    Tagged 2 devDependencies as gray
```


## Using Programmatically

### Install

```
$ npm install --save john
```

### Usage

```js
const john = require('john');

john('/path/to/project').then(
  (result) => console.log(result)
  // {
  //   dependencies: [
  //     { code: 0,
  //       command: 'xattr …',
  //       path: '/path/to/project/node_modules/finder-tag',
  //       tag: 'blue',
  //       module: 'finder-tag'
  //     },
  //     {…},
  //     {…}
  //   ],
  //   devDependencies: [
  //     {…},
  //     {…}
  //   ]
  // }
)
```


## API

### john(projectPath, [options])

#### projectPath

Type: `string`

The path to your project's directory (that contains `package.json`).

#### options

##### clear

Type: `boolean`  
Default: `false`

Clear all tags.

##### dependencyColor

Type: `string`  
Default: `blue`

Color tag to use for dependencies.

Available Colors:
* gray
* green
* purple
* blue
* yellow
* red
* orange
* clear

##### devDependencyColor

Type: `string`  
Default: `yellow`

Color tag to use for devDependencies. See available colors above.

## Why is this called John?

'John' like 'Johnny' like 'Johnny Depp' like 'Dep[p]endency'. Pfft, mainly because it was short, simple and not already taken.

## License

MIT © [DaveJ](https://twitter.com/DaveJ)
