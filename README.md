# Electron.js Command IPC Architecture

A few years ago, James Long wrote [this blog](https://archive.jlongster.com/secret-of-good-electron-apps) on how to architect Electron.js Apps to
not block the main/renderer process for long running tasks, to avoid affecting the app performance for end users. Since then, Electron.js has evolved significantly,
and we also want to architect our apps to be easily extensible and loosly-coupled like VSCode.

With that in mind, this repo is a reference implementation of a multi-process Command IPC architecture, which can be easily extended to build extensible,
performant Electron.js apps. The basic idea is:

- A background worker process provides the core backend functionality of the app
- A long running background 'sync' process, running in a secure sandboxed window to demonstrate spinning up other processes
- A render process provides the main UI visible to the user
- Each background process registers commands on start-up, which can be called from any other process/window including the main Electron.js process to do work or get data
- A client preload, shared by all windows provides an API to register commands and route command request/responses to each process
- Processes can also emit events that other processes can listen for to update their local state

The advantage of this architecture is it becomes very easy to extend the app with new commands, and split out different tasks to different processes to ensure performance. In
addition, similar to VSCode, this forms the basis of an extension model, which can allow third party developers to add new capabilities to the app, similar to VSCode.

# Development

## Setup

This project requires the following dependencies installed to run:

- Node Version Manager: https://github.com/nvm-sh/nvm
- Yarn 4.6.0: https://yarnpkg.com/getting-started/install

Then run the following commands in the root folder of the project to install all dependencies and setup your Yarn workspace (monorepo):

```bash
# Switch to use Node.js version set in .nvmrc file (make sure the version is intalled)
nvm use
# Download and install dependencies
yarn
# Build any workspace package dependencies
yarn build:packages
```

## Running Electron

To run the Electron.js app locally in development mode, run:

```bash
yarn start
```

## Testing

This repo uses [vitest](https://vitest.dev/) to run unit tests, which can be run with the following commands:

```bash
# Run all tests for all repo packages
yarn test
# Run tests for specific package
yarn workspace <package> test
# Run specific tests for file/folder in package
yarn workspace electron test ./src/commands/commands-registry.test.ts -t "should register and execute a command in WORKER"
```
