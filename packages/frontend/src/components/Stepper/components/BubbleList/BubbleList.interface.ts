/**
 * BubbleList Component Properties
 */

export interface BubbleListProps {
  /**
   * Number to step bubbles to display, must be > 0
   */
  totalSteps: number
  /**
   * labels to show in the bubbleList
   */
  labels: string[]
  /**
   * Current step number to display as active
   */
  activeStep: number
  /**
   * Optional ClassName to apply to component
   */
  className?: string
}
