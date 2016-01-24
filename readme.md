# john [![Build Status](https://travis-ci.org/davej/john.svg?branch=master)](https://travis-ci.org/davej/john)

> Make npm3's flat dependencies easier to find and sort

`npm3` has flat dependency trees, this is a good thing for many reasons.
Unfortunately, this means your `node_modules` folder might contain hundreds (or thousands?)
of modules and that makes it difficult to quickly debug/hack on issues with top-level dependencies.

# John is your man.
> *<strong>Note</strong>: This project is currently OS X & Windows only, but if you have ideas on how something similar could be implemented on other platforms then create an issue.*

* [CLI](#cli)
* [Using Programmatically](#using-programmatically)
* [API](#api)
    * [See available colors](#available-colors)
* [Why is this called John?](#why-is-this-called-john)
* [License](#license)

#### On OSX
He puts color tags on your top-level dependencies and devDependencies,
this makes your top-level dependencies easier to find and sort in Finder.

If you often use the terminal instead of finder then you can also do `ls -l | grep @` to list the folders with tags.

<p align="center"><img src ="https://cdn.rawgit.com/davej/john/a2b79a0ffc8da296d382bd99b29977195cb3976c/usage.gif" /></p>

#### On Windows
He hides away non top-level dependencies and devDependencies, leaving you with just the modules that are important to you.

<p align="center"><img src ="https://zippy.gfycat.com/ShimmeringThirstyAmericanwarmblood.gif" /></p>

## CLI

```
$ npm install --global john
```

#### OSX

```
$ john --help

  Make npm3's flat dependencies easier to find and sort

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

#### Windows

```
> john --help

  Make npm3's flat dependencies easier to find and sort

  Usage
    > john

  Options
    --clear     Clear all hidden dependencies. [Default: false]
    --deps      Hide dependencies. [Default: false]
    --dev-deps  Hide devDependencies. [Default: false]

  Examples
    $ john
    Hid 4 dependencies

    $ john --clear
    Unhid 4 dependencies
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

Clear all tags / show all dependencies.

---

##### dependencyColor

**Note:** OSX Only 

Type: `string`  
Default: `blue`

Color tag to use for dependencies. [See available colors](#available-colors).

---

##### devDependencyColor

**Note:** OSX Only

Type: `string`  
Default: `yellow`

Color tag to use for devDependencies. [See available colors](#available-colors).

---

##### dependencyHidden

**Note:** Windows only

Type: `boolean`  
Default: `false`

Set to `true` to hide dependencies

---

##### devDependencyHidden

**Note:** Windows only

Type: `boolean`  
Default: `false`

Set to `true` to hide dev dependencies

---

#### Available Colors:
**Note:** OSX only

* gray
* green
* purple
* blue
* yellow
* red
* orange
* clear

## Why is this called John?

Asking the important questions! 'John' like 'Johnny' like 'Johnny Depp' like 'Dep[p]endency'. Pfft, mainly because it was short, simple and not already taken.

## License

MIT © [DaveJ](https://twitter.com/DaveJ)
