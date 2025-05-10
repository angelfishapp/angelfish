/**
 * EmojiPicker Component Properties
 */

export interface EmojiPickerProps {
  /**
   * Should picker be open or closed
   * @default true
   */
  open?: boolean
  /**
   * Select callback function, returns emoji name
   */
  onSelect?: (emoji: string) => void
}
