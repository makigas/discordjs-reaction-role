# Security Policy

This document contains the security policy of this library.

## How to safely use this library

Until Discord figures out a way to deal with automated accounts trying to harm
or steal from their users using scams, it is important to stay alert. I tried
to do my best when developing this framework by following these procedures:

* I try to make small dependencies that do not have a lot of dependencies, to
  keep the footprint and the amount of code I import into your project low,
  to reduce the surface area by not providing unnecessary stuff.
* I try to make my code readable for humans too, so that it is possible to
  understand what is happening.
* I configure my TypeScript compiler so that the output also tries to be
  understandable by humans too. This is what lands on your node_modules,
  so this is what should be the most readable.
* I use unit tests and integration tests to reduce the chances of a bug or
  a regression affecting your project, to try to make things as safe as
  possible.
* I use semantic versioning and detailed changelogs so that you can have the
  information that you need to update this project in a way that is safe.

How to help on your side:

* Keep your dependencies up to date to save yourself from vulnerabilities.
* If you are using this project, you are encouraged to read the module code
  that gets downloaded into your node_modules directory, to validate that
  it is not compromised by a third party.

## Supported versions

While you should keep your dependencies updated, I know that keeping them up
to date is difficult. So I always support a few old versions. These are the
versions that are supported at the moment:

| Version | Supported          |
| ------- | ------------------ |
| 3.0.x   | :white_check_mark: |
| 2.0.x   | :white_check_mark: |
| 1.0.x   | :x:                |

I cannot offer support for 1.0 anymore since Discord.js 12 is deprecated and
the Discord API versions they use are already decomissioned or are going to be
decomissioned soon.
