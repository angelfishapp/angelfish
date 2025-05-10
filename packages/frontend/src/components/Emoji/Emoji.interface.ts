/**
 * Emoji Component Properties
 */

export interface EmojiProps {
  /**
   * The name of the selected emoji to display
   */
  emoji: string
  /**
   * Set the emoji width and height.
   */
  size: number
  /**
   * Optional CSS styles to apply to the emoji component
   * Note: This will not override the default styles applied to the span element
   * of the component to avoid the emoji not being displayed correctly.
   *
   * The default styles are: display, width, height, backgroundImage,
   * backgroundSize and backgroundPosition.
   */
  style?: React.CSSProperties
}
