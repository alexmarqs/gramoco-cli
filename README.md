# Gramoco CLI 📸

<div align="center">
  <img src="./.github/assets/logo_cli_app.png" width="200" height="200">
  <p>Easy interactions with the Instagram Graph API. For Business and Creator Accounts.</p>
  <a href="https://github.com/alexmarqs/gramoco-cli/actions/workflows/ci.yaml" target="_blank"><img height=20 src="https://github.com/alexmarqs/gramoco-cli/actions/workflows/ci.yaml/badge.svg" /></a>
    <a href="https://github.com/alexmarqs/gramoco-cli/actions/workflows/release.yaml" target="_blank"><img height=20 src="https://github.com/alexmarqs/gramoco-cli/actions/workflows/release.yaml/badge.svg" /></a>
  <a href="https://opensource.org/licenses/MIT" target="_blank"><img height=20 src="https://img.shields.io/badge/License-MIT-yellow.svg" /></a>

</div>

## Purpose 🎯

A friend of mine asked me to help him extract some data from his Instagram account. His main goal was to extract the comments from a post to a Excel file. I thought it would be a good idea to create a CLI app that could help him and other people to do this kind of tasks. This is the result.

## Tech stack 🤓

- [Node.js](https://nodejs.org/en/) For running JavaScript code
- [Vitest](https://vitest.dev/) For testing
- [TypeScript](https://www.typescriptlang.org/) For type checking
- [ofetch](https://www.npmjs.com/package/ofetch) For making HTTP requests
- [Tsup](https://tsup.egoist.dev) For bundling
- [Tsx](https://www.npmjs.com/package/tsx) To run TypeScript files
- [Pkg](https://github.com/vercel/pkg) Package your Node.js project into an executable
- [Inquirer.js](https://www.npmjs.com/package/inquirer) For interactive command line user interfaces
- [Nanospinner](https://www.npmjs.com/package/nanospinner) For loading spinners
- [Biome](https://biomejs.dev) For linting and formatting

## Features 🚀
- [x] Extract Instagram posts summary from your account to a Excel file
- [x] Extract Instagram comments from a post via Media ID to a Excel file (the Media ID can be found in the post information retrieved by the previous action)
- Do you have any request? [**Please open an issue!**](https://github.com/alexmarqs/gramoco-cli/issues)

## Download 📥

You can download the latest version in the [releases page](https://github.com/alexmarqs/gramoco-cli/releases) for your operating system. In alternative, you can clone this repository and build the project yourself and then install it globally (**advanced/developer users**).

## How to use / Instructions 📖

In the downloaded zip folder you will find the executable file and a config file `gramoco.config.json`. In the config file you will need to fill in the following properties: ```INSTAGRAM_ACCESS_TOKEN``` and ```INSTAGRAM_ACCOUNT_ID```. You can find the instructions to get these values in the [SETUP.md](./SETUP.md) file.

## TODO 📝

- [ ] Right now we are keeping the data in memory and then writing it to a file. This is not a good practice for large amounts of data (which may be not the case for most users). We should write the data to a file as soon as we get it from the API using streams. Add some tests to check the performance of the app.