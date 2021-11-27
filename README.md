# env-saver

CLI utility that lets you easily backup your .env files in bulk.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/env-saver.svg)](https://npmjs.org/package/env-saver)
[![Downloads/week](https://img.shields.io/npm/dw/env-saver.svg)](https://npmjs.org/package/env-saver)
[![License](https://img.shields.io/npm/l/env-saver.svg)](https://github.com/cosminmindru/env-saver/blob/master/package.json)

## Installation

```sh-session
npm install -g env-saver
```

## Usage

```sh-session
USAGE
  $ env-saver ORIGIN [DEST]

ARGUMENTS
  ORIGIN  Origin directory
  DEST    Destination directory

OPTIONS
  -D, --depth=depth  [default: 1] file lookup depth
  -V, --verbose      log additional debug output
  -h, --help         show CLI help
  -v, --version      show CLI version
```

## Example

```sh-session
$ env-saver ./code ./code-backup -D 2 -V
11:05:22 ✔️ Found 6 env files inside "code"
11:05:22 ℹ️ Destination directory "code-backup/" successfully created
11:05:22 ℹ️ Env file ".env" successfully saved
11:05:22 ℹ️ Destination directory "code-backup/monorepo/" successfully created
11:05:22 ℹ️ Env file "monorepo/.env" successfully saved
11:05:22 ℹ️ Destination directory "code-backup/monorepo/client/" successfully created
11:05:22 ℹ️ Env file "monorepo/client/.env.prod" successfully saved
11:05:22 ℹ️ Destination directory "code-backup/monorepo/server/" successfully created
11:05:22 ℹ️ Env file "monorepo/server/.env.dev" successfully saved
11:05:22 ℹ️ Destination directory "code-backup/react/" successfully created
11:05:22 ℹ️ Env file "react/.env" successfully saved
11:05:22 ℹ️ Destination directory "code-backup/serverless/" successfully created
11:05:22 ℹ️ Env file "serverless/.env" successfully saved
11:05:22 🎉 Successfully saved 6 env files inside "code-backup"
```
