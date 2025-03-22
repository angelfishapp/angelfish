import type { FormFieldProps } from '../FormField'

/**
 * EmojiField Component Properties
 */

export interface EmojiFieldProps extends FormFieldProps {
  /**
   * The default value of the `input` element. Will show question mark emoji
   * if no default value provided.
   * @default 'question'
   */
  defaultValue?: string
  /**
   * Callback for when field value is changed
   */
  onChange?: (emoji: string) => void
  /**
   * The value of the `input` element, required for a controlled component.
   */
  value?: string
}
