/**
 * Because our worker process has a Content Security Policy (CSP) which doesn't allow unsafe-eval it can't compile
 * and run validation on schemas at runtime. This script is used to generate the validation functions from the defined
 * code schemas for the DatasetService and write them to files so they can be imported and used by the worker process
 * during runtime without the need for unsafe-eval.
 */

import Ajv from 'ajv'
import standaloneCode from 'ajv/dist/standalone'
import fs from 'fs'
import path from 'path'

import { CurrenciesSchema } from '../src/services/datasets/currencies/currencies-schema'

const ajv = new Ajv({ code: { lines: true, source: true } })

// Compile validation function
const validate = ajv.compile(CurrenciesSchema)
const validateSource = standaloneCode(ajv, validate)
fs.writeFileSync(
  path.resolve(__dirname, '../src/services/datasets/currencies/currencies-validation.js'),
  `/* eslint-disable */\n// This file is auto-generated. DO NOT EDIT.\n${validateSource}`,
  'utf8',
)
