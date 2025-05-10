#!/usr/bin/env bash

# Generates a new TypeScript OpenAPI Client for http://api.angelfish.app/v1 
# Requires Docker installed on computer to work

SCHEMA='https://api.angelfish.app/v1/openapi.json'
OUTPUT_DIR='dist/generated'
SRC_DIR='src/v1'
OPENAPI_GENERATOR_IMAGE='openapitools/openapi-generator-cli:v7.10.0'

docker run --rm -v "${PWD}:/local" $OPENAPI_GENERATOR_IMAGE generate \
    -i $SCHEMA \
    -g typescript-axios --additional-properties=withSeparateModelsAndApi=true,apiPackage=api,modelPackage=models \
    -o /local/$OUTPUT_DIR/v1

# Ensure the SRC_DIR exists
mkdir -p ./$SRC_DIR/
# Copy Models to SRC_DIR
mkdir -p ./$SRC_DIR/models
cp -R ./$OUTPUT_DIR/v1/models ./$SRC_DIR
# Copy API to SRC_DIR
mkdir -p ./$SRC_DIR/api
cp -R ./$OUTPUT_DIR/v1/api ./$SRC_DIR
# Copy api.ts
cp ./$OUTPUT_DIR/v1/api.ts ./$SRC_DIR
# Copy base.ts
cp ./$OUTPUT_DIR/v1/base.ts ./$SRC_DIR
# Copy configuration.ts
cp ./$OUTPUT_DIR/v1/configuration.ts ./$SRC_DIR
# Copy common.ts
cp ./$OUTPUT_DIR/v1/common.ts ./$SRC_DIR
# Copy index.ts
cp ./$OUTPUT_DIR/v1/index.ts ./$SRC_DIR

# Generate the TypeScript OpenAPI Client for https://auth.angelfish.app Authorization APIs

SCHEMA='https://auth.angelfish.app/openapi.json'
SRC_DIR='src/auth'

docker run --rm -v "${PWD}:/local" $OPENAPI_GENERATOR_IMAGE generate \
    -i $SCHEMA \
    -g typescript-axios --additional-properties=withSeparateModelsAndApi=true,apiPackage=api,modelPackage=models \
    -o /local/$OUTPUT_DIR/auth

# Ensure the SRC_DIR exists
mkdir -p ./$SRC_DIR/
# Copy Models to SRC_DIR
mkdir -p ./$SRC_DIR/models
cp -R ./$OUTPUT_DIR/auth/models ./$SRC_DIR
# Copy API to SRC_DIR
mkdir -p ./$SRC_DIR/api
cp -R ./$OUTPUT_DIR/auth/api ./$SRC_DIR
# Copy api.ts
cp ./$OUTPUT_DIR/auth/api.ts ./$SRC_DIR
# Copy base.ts
cp ./$OUTPUT_DIR/auth/base.ts ./$SRC_DIR
# Copy configuration.ts
cp ./$OUTPUT_DIR/auth/configuration.ts ./$SRC_DIR
# Copy common.ts
cp ./$OUTPUT_DIR/auth/common.ts ./$SRC_DIR
# Copy index.ts
cp ./$OUTPUT_DIR/auth/index.ts ./$SRC_DIR

# Finally delete the temp generated output directory
rm -rf ./$OUTPUT_DIR