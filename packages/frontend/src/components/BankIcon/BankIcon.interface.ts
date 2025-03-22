/**
 * BankIcon Component Properties
 */
export interface BankIconProps {
  /**
   * Error message for bank if issue with bank Link. If set will show an error icon
   * on top of bank logo to indicate there is an issue.
   * @default Not Displayed
   */
  error?: string
  /**
   * Optionally display syncing icon on top of Icon to indicate
   * the Bank is currently syncing
   * @default false
   */
  isSyncing?: boolean
  /**
   * Base64 encoded PNG for logo. If undefined will display default bank
   * Icon
   * @default AccountBalanceIcon
   */
  logo?: string
  /**
   * Optionally set height/width dimensions of BankIcon
   * @default 50
   */
  size?: number
}
