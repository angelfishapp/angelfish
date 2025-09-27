import type { FileItem } from './ImageFileField.interface'

/**
 * Generate a unique ID for file items
 */
export const generateId = (): string =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`

/**
 * Format bytes into human-readable file size
 */
export const formatFileSize = (bytes?: number): string => {
  if (bytes === undefined || bytes === null) return 'Unknown size'
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB'] as const
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  const value = bytes / Math.pow(1024, i)
  return `${value.toFixed(1)} ${units[i] ?? 'B'}`
}

/**
 * Extension to MIME type map
 */
const extToMime: Record<string, string> = {
  pdf: 'application/pdf',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  heic: 'image/heic',
  csv: 'text/csv',
  ofx: 'application/x-ofx',
  qif: 'application/qif',
}

/**
 * Create a FileItem from File or path string
 */
export const createFileItem = (file: File | string): FileItem => {
  if (file instanceof File) {
    const extension = file.name.split('.').pop()?.toLowerCase() ?? ''
    return {
      id: generateId(),
      name: file.name,
      size: file.size > 0 ? file.size : undefined,
      type: file.type || extToMime[extension] || 'application/octet-stream',
      lastModified: file.lastModified || Date.now(),
      originalFile: file,
      previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
    }
  }

  const fileName = file.split('/').pop()?.split('\\').pop() || file
  const extension = fileName.split('.').pop()?.toLowerCase() ?? ''

  return {
    id: generateId(),
    name: fileName,
    size: undefined,
    type: extToMime[extension] ?? 'application/octet-stream',
    lastModified: Date.now(),
    originalFile: file,
  }
}

/**
 * Convert a file path (string) into an empty File placeholder
 */
export const pathToFile = async (filePath: string): Promise<File> => {
  const fileName = filePath.split('/').pop()?.split('\\').pop() || 'file'
  return new File([], fileName, {
    type: 'application/octet-stream',
    lastModified: Date.now(),
  })
}

/**
 * Fake AI process, resolves after 1 second with dummy data
 */
export async function fakeAiProcess(file: File): Promise<any> {
  return new Promise((res) =>
    setTimeout(
      () =>
        res({
          text: `Extracted data from ${file.name}`,
          fileName: file.name,
          size: file.size,
          type: file.type,
        }),
      1000,
    ),
  )
}
