/**
 * Represents a single file item managed by ImageFileField.
 */
export interface FileItem {
  /**
   * Unique identifier for the file item (used internally for selection/deletion).
   */
  id: string

  /**
   * The display name of the file.
   */
  name: string

  /**
   * The file size in bytes (if available).
   */
  size?: number

  /**
   * MIME type of the file (e.g., "image/png", "application/pdf").
   */
  type: string

  /**
   * Timestamp when the file was last modified.
   */
  lastModified: number

  /**
   * Original file reference (either a `File` object or a string path).
   */
  originalFile: File | string

  /**
   * Preview URL generated with `URL.createObjectURL()` for images.
   */
  previewUrl?: string
}

/**
 * Base props shared across all FileField components.
 */
export interface FileFieldProps {
  /**
   * Callback fired when the selected files change.
   * Returns either:
   * - an array of file paths (strings),
   * - a single file path (string), or
   * - null (if cleared).
   */
  onChange?: (files: Array<string> | string | null) => void

  /**
   * Function to trigger the file picker dialog.
   * Must return a `File`, `File[]`, string, string[], or null.
   */
  onOpenFileDialog: (
    multiple: boolean,
    fileTypes?: string[],
  ) => Promise<File | File[] | string | string[] | null>

  /**
   * Restrict selection to specific file types/extensions.
   * Example: `['.png', '.jpg', '.pdf']`
   */
  fileTypes?: string[]

  /**
   * Whether multiple file selection is allowed.
   * @default false
   */
  multiple?: boolean

  /**
   * Current value of the component (controlled).
   * Can be a list of file paths, a single file path, or null.
   */
  value: string[] | string | null
}

/**
 * Additional props specific to ImageFileField.
 */
export interface ImageFileFieldProps extends FileFieldProps {
  /**
   * Callback triggered after AI processing of selected files.
   * Provides extracted data along with the processed files.
   */
  onImageProcess?: (data: any[], files: File[]) => void

  /**
   * Callback triggered when files are dropped into the dropzone.
   */
  onDrop?: (files: File[]) => void

  /**
   * Minimum number of files required.
   */
  minFiles?: number

  /**
   * Maximum number of files allowed.
   */
  maxFiles?: number

  /**
   * Maximum size allowed per file (in bytes).
   */
  maxFileSize?: number

  /**
   * Placeholder text displayed inside the dropzone.
   */
  placeholder?: string
}
