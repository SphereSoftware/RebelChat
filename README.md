# RebelChat
> Be Rebel - Chat Rebel. 💬


[![Build Status](https://travis-ci.org/SphereSoftware/RebelChat.svg?branch=master)](https://travis-ci.org/SphereSoftware/RebelChat)
![appveyor Build Status](https://ci.appveyor.com/api/projects/status/github/SphereSoftware/RebelChat?branch=master&svg=true)
[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/hyperium/hyper/master/LICENSE)


`RebelChat` is a integrated `Chat` system for the Hackable Atom Editor. It is a modern way to keep
in touch with any team, and keep your messaging under control right in your editor.

## Why

This project aims to provide unified `UI`/`UX` for all available communication channels. We do believe that you
don't need to install and track all different chat apps, if all you need is just `chat` with your
friends and colleagues.

 ![RebelChat](https://cloud.githubusercontent.com/assets/31591/19906983/1472c6b4-a08e-11e6-9415-27f316bfff65.gif)

## How to start

To start `RebelChat` just press `ctrl`-`alt`-`cmd`-`m`, enter you credentials and enjoy
your chatting experience.

By default `RebelChat` provides some `keymaps`. But feel free to change it any way you want. You can
read more about `keymaps` [here](http://flight-manual.atom.io/behind-atom/sections/keymaps-in-depth/)

### Default Keymaps

Here is all default `keymaps`, but you can always disable it in `package` settings, or add your own
in your `~/.atom/keymap.cson` file.

| Command                                           | macOS                  | Windows | Linux |
|:--------------------------------------------------|:-----------------------|:--------|:------|
| `rebel-chat:toggle` (toggles main window)         | `ctrl`-`alt`-`cmd`-`m` |         |       |
| `rebel-chat:choose-channel` (open channel select) | `cmd`-`shift`-`k`      |         |       |
| `rebel-chat:focus-input` (focus master input)     | `cmd`-`l`              |         |       |
| `rebel-chat:team-1` (switch to team 1)            | `cmd`-`1`              |         |       |
| `rebel-chat:team-2` (...)                         | `cmd`-`2`              |         |       |
| `rebel-chat:team-3` (...)                         | `cmd`-`3`              |         |       |
| `rebel-chat:team-4` (...)                         | `cmd`-`4`              |         |       |
| `rebel-chat:team-5` (...)                         | `cmd`-`5`              |         |       |
| `rebel-chat:team-6` (...)                         | `cmd`-`6`              |         |       |
| `rebel-chat:team-7` (...)                         | `cmd`-`7`              |         |       |
| `rebel-chat:team-8` (...)                         | `cmd`-`8`              |         |       |
| `rebel-chat:team-9` (...)                         | `cmd`-`9`              |         |       |


## Installation

* In Atom, open *Preferences* (*Settings* on Windows)
* Go to *Install* section
* Search for `RebelChat` package. Once it found, click `Install` button to install package.

### Manual installation

You can install the latest `RebelChat` version manually from console:


```bash
$ apm i RebelChat
```

If you wish you can install it from source, so you will be able to develop it test it on your own
environment.

```bash
$ git clone git@github.com:SphereSoftware/RebelChat.git && cd RebelChat
$ apm i
$ apm link .
```

Then restart Atom editor. This command will clone, install all dependencies, and link `RebelChat` to
the `~/.atom/packages` folder

## Thanks

This project sponsored by [Sphere Software](https://sphereinc.com/) as part of our `Open Source`
initiative.

## License
----

The MIT License (MIT)

Copyright (c) 2017 Anton Shemerey [@shemerey](https://github.com/shemerey)

Full license file [here](LICENSE.md)
