import type { InputBaseProps } from '@mui/material/InputBase'

/**
 * Search Component Properties
 */
export interface SearchProps extends Omit<InputBaseProps, 'onChange'> {
  /**
   * Field placeholder string.
   * @default 'Search...'
   */
  placeholder?: string
  /**
   * Adds a drop-shadow.
   * @default true
   */
  hasShadow?: boolean
  /**
   * On change callback handler.
   */
  onChange?: (search: string) => void
}
