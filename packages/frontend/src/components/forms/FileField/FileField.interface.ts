import type { FormFieldProps } from '../FormField'

/**
 * FileField Component Properties
 */

export interface FileFieldProps extends FormFieldProps {
  /**
   * Allow multiple files to be selected
   * @default false
   */
  multiple?: boolean
  /**
   * Callback when the value changes. Returns the selected file(s) path(s)
   */
  onChange: (value: string[] | string | null) => void
  /**
   * Async Callback to open the file dialog. Returns the selected file(s) path(s)
   * or null if no file was selected.
   *
   * @param multiple Allow multiple files to be selected
   * @param fileTypes Optional set array of file extensions that can be selected (i.e. ['jpg', 'png']])
   */
  onOpenFileDialog: (multiple: boolean, fileTypes?: string[]) => Promise<string[] | string | null>
  /**
   * Optional set array of file extensions that can be selected (i.e. ['jpg', 'png']])
   * If not provided any file type can be selected. DO NOT USE dots in file extensions or they
   * won't appear on Windows/Linux (i.e. 'jpg' not '.jpg' or '*.jpg')
   */
  fileTypes?: string[]
  /**
   * Input placeholder text
   * @default 'Select File...' or 'Select Files...' if multiple = true
   */
  placeholder?: string
  /*
   * Set the selected file(s) path(s) or null to clear the selection
   */
  value: string[] | string | null
  /*
   * Visual variant of the FileField component
   * @default 'default'
   */
  variant?: 'default' | 'dropzone'
}
