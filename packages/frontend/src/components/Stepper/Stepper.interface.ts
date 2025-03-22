/**
 * Stepper Component Properties
 */

export interface StepperProps {
  /**
   * Set the active Step in Workflow
   */
  activeStep: number
  /**
   * List of StepPanels to display setup steps
   */
  children: React.JSX.Element[]
  /**
   * Should clicking on the backdrop close the stepper
   * @default false
   */
  disableBackdropClick?: boolean
  /**
   * Show blured background for modal style stepper if true, otherwise
   * show no background blur/darkening
   * @default false
   */
  displayBackdrop?: boolean
  /**
   * Should the stepper appear or be hidden
   * @default true (show the stepper)
   */
  open?: boolean
  /**
   * Optional List of labels to be displayed in the stepper
   */
  labels?: string[]
  /**
   * Callback to be called when the stepper is closed
   */
  onClose?: () => void
  /**
   * Callback triggered when exit animation ends
   */
  onTransitionEnd?: () => void
}
