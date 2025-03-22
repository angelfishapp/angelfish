import type { SvgIconProps } from '@mui/material/SvgIcon'
import type React from 'react'

import type { FormFieldProps } from '../FormField'

/**
 * AvatarField Component Properties
 */

export interface AvatarFieldProps extends Omit<FormFieldProps, 'size'> {
  /**
   * Array of PNG Base64 encoded Avatars User Can Select from
   */
  avatars: string[]
  /**
   * Callback for when user changes their Avatar
   */
  onChange: (avatar: string) => void
  /**
   * Optional Icon to display if no user is set
   * @default '@mui/icons-material/Person'
   */
  Icon?: React.ComponentType<SvgIconProps>
  /**
   * Set field display avatar size in px
   * @default 80
   */
  size?: number
  /**
   * Set the size of the dialog avatars in px
   * @default 60
   */
  dialogSize?: number
  /**
   * Dialog Title to display at top
   * @default 'Pick Your Avatar'
   */
  dialogTitle?: string
  /**
   * The value of the `input` element, required for a controlled component.
   */
  value?: string
}
