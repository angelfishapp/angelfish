/**
 * Script to take an input file and Obfuscate the data for privacy.
 *
 * Use this to take a real import file from a bank and create an obfuscated version for testing
 * without your private transaction data being exposed.
 *
 * Usage:
 *
 * ts-node scripts/obfuscate.ts -f <file-path> [-c <description-column-name>]
 */

import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

/**
 * Parses command line arguments to get the file path and CSV column from command line arguments
 * and returns them as an object. Will throw error if -f flag is not provided or if the file
 * extension is not csv, qfx, ofx or qif.
 *
 * @returns     Mapped arguments for 'file' and 'col'
 */
function parseArgs(): { file: string; ext: string; col?: string } {
  const args = process.argv.slice(2) // Ignore the first two arguments (node and script path)
  const argMap: { [key: string]: string } = {}

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '-f' && args[i + 1]) {
      argMap['file'] = join(process.cwd(), args[i + 1])
      // Get file extension
      argMap['ext'] = argMap['file'].split('.').pop() as string
    } else if (args[i] === '-c' && args[i + 1]) {
      argMap['col'] = args[i + 1]
    }
  }

  // Check file path is provided
  if (!argMap['file']) {
    console.error('Please provide a file path with the -f flag')
    process.exit(1)
  }

  // If file extension is not csv, qfx, ofx or qif, exit
  if (!argMap['ext'] || !['csv', 'qfx', 'ofx', 'qif'].includes(argMap['ext'])) {
    console.error('File must be a CSV, QFX, OFX or QIF file')
    process.exit(1)
  }

  // @ts-ignore
  return argMap
}

/**
 * Generate a random, unique string
 *
 * @param length    The length of the random string to generate
 * @returns        A random string of the specified length
 */
function generateRandomString(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 '
  let randomString = ''

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    randomString += characters[randomIndex]
  }

  // Check if all characters are the same
  if (new Set(randomString).size === 1) {
    // If all characters are the same, recursively generate a new string
    return generateRandomString(length)
  }

  return randomString
}

// Parse command line arguments
const args = parseArgs()

console.log(`Obfuscating file "${args.file}" of type "${args.ext}" ...`)

try {
  // Read the file
  const file = readFileSync(args.file, 'utf8')

  // Switch on file extension
  switch (args.ext) {
    case 'csv':
      // TODO: Implement CSV obfuscation
      console.log('CSV files are not supported yet')
      break
    case 'ofx':
    case 'qfx':
      // Find all <NAME> tags and replace text afterwards until next <> tag (but excluding the last tag) with random string
      let obfuscatedFile = file.replace(/<NAME>([^<]*)/g, (_, value) => {
        const randomName = generateRandomString(value.length)
        return `<NAME>${randomName}`
      })
      // Find all <MEMO> tags and replace text afterwards until next <> tag (but excluding the last tag) with random string
      obfuscatedFile = file.replace(/<MEMO>([^<]*)/g, (_, value) => {
        const randomMemo = generateRandomString(value.length)
        return `<MEMO>${randomMemo}`
      })

      // Write the obfuscated file
      writeFileSync(args.file, obfuscatedFile, 'utf8')

      break
    case 'qif':
      // Split the file into lines and replace any line starting with P with a random string afterwards
      const lines = file.split('\n')
      const obfuscatedLines = lines.map((line) => {
        if (line.startsWith('P')) {
          return line.replace(/P.*/, `P${generateRandomString(10)}`)
        }
        return line
      })

      // Write the obfuscated file
      writeFileSync(args.file, obfuscatedLines.join('\n'), 'utf8')
      break
  }
} catch (err) {
  console.error(`Error reading file: ${err.message}`)
  process.exit(1)
}
