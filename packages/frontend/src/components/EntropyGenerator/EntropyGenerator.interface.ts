/**
 * Entropy Generator Component Properties
 */
export interface EntropyGeneratorProps {
  /**
   * Size for width/height in px of canvas to generate entropy
   * @default 300
   */
  size?: number
  /**
   * Callback function when the seed is generated from the mouse movements
   */
  onChange?: (seed: string) => void
}

/**
 * Entropy Generator Trigger Methods passed to parent component reference
 * so it can call the methods from the child component
 */
export interface EntropyGeneratorMethods {
  /**
   * Reset and clear the canvas
   */
  reset: () => void
}
