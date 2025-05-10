# @angelfish/cloudapiclient

Generated Axios-Typescript OpenAPI Client for Cloud APIs located at https://api.angelfish.app for logging users in
and syncronising financial data for app.

Main shell script to generate library and keep up to date as API changes is located under the `scripts` folder. It
uses the [OpenAPI generator docker container](https://hub.docker.com/r/openapitools/openapi-generator-cli)
to generate the client from the schema, so docker must be running on your system.

To generate a new version of the library that has up to date API definitions run the following command:

```
yarn generate-api-cli
```
