/**
 * Background Component Properties
 */
export interface BackgroundProps {
  /**
   * Optionally turn off all background animations
   * @default false
   */
  disableAnimations?: boolean
  /**
   * Which background view to show (Default 'land')
   *
   *  * underwater: Background will show submerged view for when logged into app
   *  * land: Background will show mountains/clouds for login view
   *  * sky: Background will ascend into sky for Forgotten password
   */
  view?: 'underwater' | 'land' | 'sky'
  /**
   * What phase of the day is it (Default: day)
   */
  phase?: 'day' | 'morning' | 'evening' | 'night'
  /**
   * How often should the background update it's phase in minutes,
   * will be disabled if phase is set explicitly using phase property
   * (Default 15mins)
   */
  updateFrequency?: number
  /**
   * Callback for when background view transition has completed
   */
  onTransitionEnd?: (view: string) => void
}
