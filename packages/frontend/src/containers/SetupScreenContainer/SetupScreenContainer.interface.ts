/**
 * Setup Screen Container Component Properties
 */
export interface SetupScreenContainerProps {
  /**
   * Callback for when Setup is Completed All Steps
   */
  onComplete: () => void
  /**
   * Callback for when Setup is Started
   */
  onStart: () => void
}
