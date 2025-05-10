import { config } from 'dotenv'
import { resolve } from 'path'
import 'reflect-metadata'

import { mockAngelfishCoreLib } from '@angelfish/tests'

// Load a custom env file
const envFilePath = resolve(__dirname, '../../../.env')
console.log('Loading custom env file', envFilePath) // eslint-disable-line no-console
config({ path: envFilePath })

mockAngelfishCoreLib()
