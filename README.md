<p align="center">
  <img src="https://user-images.githubusercontent.com/25379378/91234528-4903ac00-e6e8-11ea-967c-0815ca09cc36.png" alt="Angelfish Logo" width="360" />
</p>

<div align="center">

**A local first personal finance app built for couples.**<br/>
[Download](https://angelfish.app) | [Website](https://angelfish.app) | [User Docs](https://angelfish.app/docs)

[![Package and Release](https://github.com/angelfishapp/angelfish/actions/workflows/build.yml/badge.svg)](https://github.com/angelfishapp/angelfish/actions/workflows/build.yml)

</div>

## About

Angelfish is a local first personal finance app built for couples. This means your private financial data will never be stored in our Cloud, but only locally on your devices. A decentralised
database is being developed to add later which will allow you to access your data securely across different devices and collaborate with other users you invite into your household with built in
end-to-end encryption.

Angelfish supports the following features:

- Add all your cash/day-to-day Bank Accounts and their respective Transactions to get a single view of your spending (Investment/Loan Accounts will be added in future)
- Importing your Transaction data from your Bank's OFX, QFX, QIF or CSV exports
- Smart Reconciliation - NO RULES that quickly get complicated and out of date, the system learns how to automatically categorise your transactions over time
- Multi-Currency so you can track your Income and Expenses around the World
- Bank Account Owners so you can track your Income and Expenses by each person in your household
- Categories and Category Groups to track where your Income and Expenses are coming from and get detailed breakdowns
- Category types so you can organise your Income by Earned or Passive sources, and Expenses by Critical, Important or Optional to get more visibility into your Income and Expenses
- Detailed Monthly Income and Expense Reports to track your Income/Expenses over time with detailed breakdowns
- Ability to export your Reports to Excel for custom analysis

You can learn more about Angelfish's origin story and vision [here](https://angelfish.app/articles/origin-story).

## Getting Started

You will need the following installed on your machine to setup your local machine for development:

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

# Development

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

## Other Scripts

**Note: For any commands running shell scripts, ensure you've updated the file permissions for the files so they can be run:
`chmod +x ./scripts/*.sh`. Also all scripts have only been developed and run on MacOS so may not run correctly on other operating systems.**

```bash
# Run storybook to edit and test frontend UI components
yarn storybook

# To run eslint and prettier to check & format code
yarn lint # Only run eslint
yarn prettify # Only run prettier
yarn format # Run both

# To run all TypeScript checks across packages
yarn ts-check

# compile source code and create webpack output
yarn compile

# `yarn compile` & create distribution build with electron-forge
yarn make

# compile and publish app to different repositories with notorised builds
yarn publish

# run script to generate a new Cloud API TypeScript Client under the packages/cloudapiclient/src directory from the OpenAPI Spec
yarn generate-api-cli

# run script to generate app icons for MacOS/Windows
yarn generate-app-icons

# Generate 100x100 data:png avatars in the @angelfish/core library
yarn generate-avatars
```

# Contributing

We welcome anyone who wants to fork and raise a PR back to this project with the following conditions:

1. Your contribution is OK to be accepted under the AGPL-V3 license
1. You follow the [Coding Guidelines](https://github.com/angelfishapp/angelfish/wiki/Code-Design-Guidelines) for this project
1. All tests need to be passing before a PR will be accepted
1. Please keep PRs small and focused so they're easier to review and merge
1. **New Features**: _Please raise a Github issue before implementing a new feature to check that the feature will be accepted before you start developing it._ We welcome all bug fixes and improvements to existing features, but plan to implement an extension system in future which will allow any developer to extend and customise Angelfish without modifying the core project. Therefore we want to keep the core project small and focused for now on its core use cases. Features we see for future extensions that will not be added to the core project currently are budgeting, financial planning, tracking investment and loan accounts, bank syncronisation, among others. In general these are features that are not part of the core vision for Angelfish (i.e. Budgeting) or potential features we may monitize in future to support the project (i.e. financial planning and investments) or cost money to provide (i.e. Plaid integration to synconize bank accounts). Some of these areas are subject to change over time if we see a good argument or use case that should be supported in the core product, so start by creating an issue and we can have a discussion online or come back and revise decisions if needed in future.
