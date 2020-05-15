# dotnet-run

[![AppVeyor build status](https://img.shields.io/appveyor/ci/mortend/dotnet-run/master.svg?logo=appveyor&logoColor=silver&style=flat-square)](https://ci.appveyor.com/project/mortend/dotnet-run/branch/master)
[![Travis CI build status](https://img.shields.io/travis/mortend/dotnet-run/master.svg?style=flat-square)](https://travis-ci.org/mortend/dotnet-run)
[![NPM package](https://img.shields.io/npm/v/dotnet-run.svg?style=flat-square)](https://www.npmjs.com/package/dotnet-run)
[![License: MIT](https://img.shields.io/github/license/mortend/dotnet-run.svg?style=flat-square)](LICENSE)
![Supported platforms](https://img.shields.io/badge/os-Linux%20%7C%20macOS%20%7C%20Windows-7F5AB6?style=flat-square)

> Run Mono and .NET programs easily on all platforms.

## Install

```
$ npm install dotnet-run
```

This will detect [Mono](https://www.mono-project.com/)/.NET or automatically download a suitable version for your system.

### macOS

![install](https://img.shields.io/badge/install-auto-brightgreen?style=flat-square&logo=apple&logoColor=silver)
![mono](https://img.shields.io/badge/mono-v6.0.0.311-blue?style=flat-square)
![downloads](https://img.shields.io/github/downloads/mortend/dotnet-run/total?color=blue&style=flat-square)

Unless we can find Mono v6.0.0.311 or greater on your system, we will provide you a minimal Mono installation automatically.

> We provide minimal Mono releases for macOS, much smaller than official releases. Our v6.0.0.311 is distributed as a 33.6 MB tarball, which installs faster and is more than ten times smaller than the official pkg installer at 362.2 MB. Our package is unobtrusive to your system and will safely co-exist with any existing Mono install you may or may not have from before.

### Linux

![install](https://img.shields.io/badge/install-manual-orange?style=flat-square&logo=linux&logoColor=silver)
![mono](https://img.shields.io/badge/mono-v6.0.0.311-blue?style=flat-square)

Linux users must provide their own Mono install before consuming this package. More information can be found on [this page](https://www.mono-project.com/download/).

### Windows

![install](https://img.shields.io/badge/install-auto-brightgreen?style=flat-square&logo=windows&logoColor=silver)
![install](https://img.shields.io/badge/netfx-built--in-blue?style=flat-square)

We use the built-in .NET Framework on Windows.

## Usage

```js
const run = require('dotnet-run');

run('bang.exe', ['pong', 'pang'], process.exit);
```

or, in Terminal:

```
$ dotnet-run bang.exe pong pang

Hello, pong pang!
```

```
$ dotnet-run --version

Mono JIT compiler version 6.0.0.311 (2019-02/494641b300c Mon Jul  1 20:30:26 EDT 2019)
Copyright (C) 2002-2014 Novell, Inc, Xamarin Inc and Contributors. www.mono-project.com
	TLS:           
	SIGSEGV:       altstack
	Notification:  kqueue
	Architecture:  amd64
	Disabled:      none
	Misc:          softdebug 
	Interpreter:   yes
	LLVM:          yes(600)
	Suspend:       hybrid
	GC:            sgen (concurrent by default)
```

## Contributing

Please [report an issue](https://github.com/mortend/dotnet-run/issues) if you encounter a problem, or [open a pull request](https://github.com/mortend/dotnet-run/pulls) if you make a patch.
