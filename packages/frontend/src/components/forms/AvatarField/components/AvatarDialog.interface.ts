/**
 * AvatarDialog Component Properties
 */

export interface AvatarPickerDialogProps {
  /**
   * Current user avatar
   */
  current: string
  /**
   * Array of Base64 encoded Avatars User Can Select from
   */
  avatars: string[]
  /**
   * Callback to update Avatar when user selects an Avatar
   */
  onSelect: (avatar: string) => void
  /**
   * Is the dialog open or not (Default false)
   */
  open?: boolean
  /**
   * Callback triggered when dialog is closed
   */
  onClose?: () => void
  /**
   * Height/Width of Avatar
   * @default 60
   */
  size?: number
  /**
   * Dialog Title to display at top
   * @default 'Pick Your Avatar'
   */
  title?: string
}
