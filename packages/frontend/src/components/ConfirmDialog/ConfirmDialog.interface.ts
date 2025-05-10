/**
 * ConfirmDialog Component Properties
 */
export interface ConfirmDialogProps {
  /**
   * Text to display on Cancel button
   * @default 'Cancel'
   */
  cancelText?: string
  /**
   * React component to render inside drawer
   */
  children: React.ReactNode
  /**
   * Color for Confirmation Button
   * @default 'primary'
   */
  confirmButtonColor?: 'primary' | 'error'
  /**
   * Should the confirm button be disabled
   * @default false
   */
  confirmButtonDisabled?: boolean
  /**
   * Text to display on Confirm button
   * @default 'OK'
   */
  confirmText?: string
  /**
   * Callback triggered when closing drawer
   */
  onClose?: () => void
  /**
   * Callback triggered when clicking confirm button
   */
  onConfirm?: () => void
  /**
   * Show (true) or hide (false) the drawer
   * @default false
   */
  open?: boolean
  /**
   * Display Title for Drawer
   */
  title: string

  /**
   * Should it autoFocus CTA
   */
  autoFocus?: boolean
}
