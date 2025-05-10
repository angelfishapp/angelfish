import type { SvgIconProps } from '@mui/material/SvgIcon'
import type React from 'react'

/**
 * Component Properties
 */
export interface AvatarProps {
  /**
   * Optional Base64 Encoded Avatar Image. Will display
   * placeholder icon if not set.
   */
  avatar?: string
  /**
   * Optional User's firstName
   */
  firstName?: string
  /**
   * Optional User's lastName
   */
  lastName?: string
  /**
   * Optional Icon to display if no user is set
   * @default '@mui/icons-material/Person'
   */
  Icon?: React.ComponentType<SvgIconProps>
  /**
   * Optionally set width & height for Avatar
   * @default 40
   */
  size?: number
  /**
   * Optional ClassName to apply to Avatar
   */
  className?: string
  /**
   * Optionally display a border around avatart
   * @default false
   */
  displayBorder?: boolean
}
