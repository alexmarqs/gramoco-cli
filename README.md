# Gramoco CLI 📸

<div align="center">
  <img src="./.github/assets/logo_cli_app.png" width="200" height="200">
  <p>Easy interactions with the Instagram Graph API. For Business and Creator Accounts.</p>
  <a href="https://github.com/alexmarqs/gramoco-cli/actions/workflows/ci.yaml" target="_blank"><img height=20 src="https://github.com/alexmarqs/gramoco-cli/actions/workflows/ci.yaml/badge.svg" /></a>
    <a href="https://github.com/alexmarqs/gramoco-cli/actions/workflows/release.yaml" target="_blank"><img height=20 src="https://github.com/alexmarqs/gramoco-cli/actions/workflows/release.yaml/badge.svg" /></a>
  <a href="https://opensource.org/licenses/MIT" target="_blank"><img height=20 src="https://img.shields.io/badge/License-MIT-yellow.svg" /></a>

</div>

## Purpose 🎯

A friend of mine needed help extracting data from his Instagram account. He mainly wanted to get the comments from a post into an Excel file. I thought, why not make a CLI app for this? It could be useful for him and others needing to do the same thing. So, here's what I ended up creating.

## Donations 💰

If you like this project and you want to support it, you can do it through [PayPal](https://www.paypal.com/donate/?hosted_button_id=G3GPPS9EB35W4)!

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
- [Zod Config](https://github.com/alexmarqs/zod-config) For loading configuration from several sources using Zod

## Features 🚀
- [x] Extract Instagram posts summary from your account to a Excel file
- [x] Extract Instagram comments from a post via Media ID to a Excel file (the Media ID can be found in the post information retrieved by the previous action)
- Do you have any request? [**Please open an issue!**](https://github.com/alexmarqs/gramoco-cli/issues)

## Download 📥

You can download the latest version in the [releases page](https://github.com/alexmarqs/gramoco-cli/releases) for your operating system. In alternative, you can clone this repository and build the project yourself and then install it globally (**advanced/developer users**).

## How to use / Instructions 📖

In the downloaded zip folder you will find the executable file and a config file `gramoco.config.json`. In the config file you will need to fill in the following properties: ```INSTAGRAM_ACCESS_TOKEN``` and ```INSTAGRAM_ACCOUNT_ID```. You can find the instructions to get these values in the [SETUP.md](./SETUP.md) file.
