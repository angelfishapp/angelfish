import type React from 'react'

import type { CurrencyCode } from '@angelfish/core'

/**
 * CurrencyLabel Component Properties
 */

export interface CurrencyLabelProps {
  /**
   * Optional className for component
   */
  className?: string
  /**
   * Currency to show at beginning (Default: USD)
   * 3-digit alphabetic currency codes from the ISO 4217 Currency Codes
   */
  currency?: CurrencyCode
  /**
   * Display decimal part of the currency
   * @default true
   */
  displayDecimals?: boolean
  /**
   * Main fontsize for integer part of the currency.
   * Decimal part will be 0.8em of this size.
   */
  fontSize?: React.CSSProperties['fontSize']
  /**
   * Provide an onClick handler for the component
   */
  onClick?: () => void
  /**
   * Show positive sign in front of value
   * @default false
   */
  showPositive?: boolean
  /**
   * Currency amount
   * @default 0
   */
  value: number
}
