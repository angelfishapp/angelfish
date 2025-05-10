/**
 * Script to generate Base64 encoded images from PNG files in the resources directory
 * and write them to a file so they can be imported and used in the app
 *
 * Usage: `yarn generate-avatars`
 */
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

// Relative path to the resources directory
const resourcesDir = './resources'

// Function to get all PNG files in a directory
function getPngFiles(dir: string): string[] {
  return fs
    .readdirSync(dir)
    .filter((file) => path.extname(file).toLowerCase() === '.png')
    .map((file) => path.join(dir, file))
}

// Function to resize and encode an image to Base64
async function resizeAndEncodeImage(filePath: string, size: number): Promise<string> {
  const buffer = await sharp(filePath).resize(size, size).toBuffer()
  return buffer.toString('base64')
}

/**
 * Main function to process images and write to file
 *
 * Gets all png files in the resources directory, resizes and encodes them to PNG Base64
 * and writes them to src/data/avatars.ts file so they can be imported and used in the app
 *
 * Excludes the `data:image/png;base64` prefix from the Base64 string so add this back if
 * needed
 */
async function processImages() {
  // Process user_avatars first
  const userAvatarFiles = getPngFiles(path.join(resourcesDir, 'user_avatars'))
  const userAvatars: string[] = []
  for (const file of userAvatarFiles) {
    const base64Image = await resizeAndEncodeImage(file, 100)
    userAvatars.push(base64Image)
  }

  // Process book_avatars next
  const bookAvatarFiles = getPngFiles(path.join(resourcesDir, 'book_avatars'))
  const bookAvatars: string[] = []
  for (const file of bookAvatarFiles) {
    const base64Image = await resizeAndEncodeImage(file, 100)
    bookAvatars.push(base64Image)
  }

  // Write the output to a file
  const outputContent =
    `export const USER_AVATARS: string[] = ${JSON.stringify(userAvatars, null, 2)}` +
    '\n\n' +
    `export const BOOK_AVATARS: string[] = ${JSON.stringify(bookAvatars, null, 2)}` +
    '\n'
  const outputFilePath = path.join(__dirname, '../src/data/avatars.ts')
  fs.writeFileSync(outputFilePath, outputContent)
  console.log(`Base64 encoded images saved to ${outputFilePath}`) // eslint-disable-line no-console
}

// Execute the main function
processImages().catch((error) => console.error(error)) // eslint-disable-line no-console
