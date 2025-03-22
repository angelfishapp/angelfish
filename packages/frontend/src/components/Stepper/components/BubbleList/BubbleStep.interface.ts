/**
 * Component Properties
 */

export interface BubbleStepProps {
  /**
   * Number to display in bubble
   */
  stepNumber: number
  /**
   * Number to display in bubble
   */
  label: string
  /**
   * Is Step Active (true) or Not (false) (Default: false)
   */
  isActive?: boolean
  /**
   * Is Step Complete (true) or Not (false) (Default: false)
   */
  isComplete?: boolean
  /**
   * Show Delay to initially show the bubble after render in seconds
   * (Default 1.5s)
   */
  showDelay?: number
}
