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

We provide minimal Mono releases much smaller than official releases. For example, our Mono 6.0.0.311 for macOS is a 33.4 MB tarball, which installs faster and is more than ten times smaller than the official pkg installer at 362.2 MB.

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
