/**
 * Custom Error for File Extension Unsupported
 */
export class FileExtensionError extends Error {
  constructor(ext: string) {
    super(`The filename extension ${ext} is not supported.`)
    this.name = 'FileExtensionError'
  }
}

/**
 * Custom Error for File Already Exists
 */
export class FileAlreadyExistsError extends Error {
  constructor(filePath: string) {
    super(`File ${filePath} already exists.`)
    this.name = 'FileAlreadyExistsError'
  }
}

/**
 * Custom Error for File Not Found
 */
export class FileNotFoundError extends Error {
  constructor(filePath: string) {
    super(`File ${filePath} does not exist.`)
    this.name = 'FileNotFoundError'
  }
}
