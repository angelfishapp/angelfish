import type { ReactNode } from 'react'

/**
 * Step Component Properties
 */

export interface StepProps {
  /**
   * Display title at top of panel
   */
  title: string
  /**
   * Next Step title to display in Complete Button at bottom
   * of panel
   */
  nextStep: string
  /**
   * Content to diplay in the panel
   */
  children: ReactNode
  /**
   * Is step complete and button enabled (Default: false)
   */
  isReady?: boolean
  /**
   * If set, will display a cancel button in the panel that
   * will call onCancel callback when clicked
   */
  onCancel?: () => void
  /**
   * Callback to move to next step in setup workflow
   */
  onNext: () => Promise<void>
}
