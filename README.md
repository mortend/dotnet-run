# dotnet-run

[![Travis CI build status](https://img.shields.io/travis/mortend/dotnet-run/master.svg?style=flat-square)](https://travis-ci.org/mortend/dotnet-run)
[![NPM package](https://img.shields.io/npm/v/dotnet-run.svg?style=flat-square)](https://www.npmjs.com/package/dotnet-run)
[![License: MIT](https://img.shields.io/github/license/mortend/dotnet-run.svg?style=flat-square)](LICENSE)

> Runs Mono and .NET assemblies, easily.

## Install

```
npm install dotnet-run
```

This will detect your existing [Mono](https://www.mono-project.com/) installation or automatically download a suitable version for your system.

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

Mono JIT compiler version 5.4.1.7 (2017-06/e66d9abbb27 Wed Oct 25 12:10:41 EDT 2017)
Copyright (C) 2002-2014 Novell, Inc, Xamarin Inc and Contributors. www.mono-project.com
	TLS:           normal
	SIGSEGV:       altstack
	Notification:  kqueue
	Architecture:  amd64
	Disabled:      none
	Misc:          softdebug 
	LLVM:          yes(3.6.0svn-mono-master/8b1520c8aae)
	GC:            sgen (concurrent by default)
```

## Contributing

Please [report an issue](https://github.com/mortend/dotnet-run/issues) if you encounter a problem, or [open a pull request](https://github.com/mortend/dotnet-run/pulls) if you make a patch.
