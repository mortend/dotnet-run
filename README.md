# dotnet-run

[![AppVeyor build status](https://img.shields.io/appveyor/ci/mortend/dotnet-run/master.svg?logo=appveyor&logoColor=silver&style=flat-square)](https://ci.appveyor.com/project/mortend/dotnet-run/branch/master)
[![NPM package](https://img.shields.io/npm/v/dotnet-run.svg?style=flat-square)](https://www.npmjs.com/package/dotnet-run)
[![NPM downloads](https://img.shields.io/npm/dt/dotnet-run?color=blue&style=flat-square)](https://www.npmjs.com/package/dotnet-run)
[![License: MIT](https://img.shields.io/github/license/mortend/dotnet-run.svg?style=flat-square)](LICENSE)
![Supported platforms](https://img.shields.io/badge/os-Linux%20%7C%20macOS%20%7C%20Windows-7F5AB6?style=flat-square)

> Run .NET programs easily on all platforms

## Install

```sh
npm install dotnet-run
```

## Usage

### JavaScript

```js
const run = require("dotnet-run")

await run("hello.dll", ["javascript", "typescript"])

// => Hello, javascript and typescript!
```

```js
const { getDotNetPath, installDotNet } = require("dotnet-run")

const dotnet = getDotNetPath()

if (!dotnet) {
    await installDotNet()
}
```

## Contributing

Please [report an issue](https://github.com/mortend/dotnet-run/issues) if you encounter a problem, or [open a pull request](https://github.com/mortend/dotnet-run/pulls) if you make a patch.
