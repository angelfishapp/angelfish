import type {
  IAccount,
  ImportTransactionsMapper,
  ParsedFileMappings,
  ReconciledTransaction,
} from '@angelfish/core'

/**
 * ImportTransactions Component Properties
 */
export interface ImportTransactionsProps {
  /**
   * Full list of available Accounts for Categorising
   * Transactions in the Table with Parent Relations Attached
   */
  accountsWithRelations: IAccount[]
  /**
   * The Default Account to import Transactions into
   */
  defaultAccount: IAccount
  /**
   * Modal open state
   * @default false
   */
  open?: boolean
  /**
   * Callback to close the modal
   */
  onClose?: () => void
  /**
   * Async Callback to open the file dialog. Returns the selected file(s) path(s)
   * or null if no file was selected.
   *
   * @param multiple  Allow multiple files to be selected
   * @param fileTypes Optional set array of file extensions that can be selected (i.e. ['jpg', 'png']])
   * @returns         The absolute path of the selected file(s) on the local filesystem
   */
  onOpenFileDialog: (multiple: boolean, fileTypes?: string[]) => Promise<string[] | string | null>
  /**
   * Async callback to get the CSV column headers of the selected file
   *
   * @param file      The absolute path of the selected file on the local filesystem
   * @param delimiter The delimiter used in the CSV file (@default ',')
   * @param startDate Optional start date for AI extraction to help contextualize transaction dates
   * @returns         ParsedFileMappings
   */
  onGetFileMappings: (
    file: string,
    delimiter?: string,
    startDate?: Date,
  ) => Promise<ParsedFileMappings>
  /**
   * Async callback to get the Transaction data from the selected file
   *
   * @param file      The absolute path of the selected file on the local filesystem
   * @param csvMapper Optional mapper object for CSV files to map CSV headers to Transaction properties
   * @returns         An array of reconciled transactions for user to review before importing
   */
  onReconcileTransactions: (
    file: string,
    mapper: ImportTransactionsMapper,
  ) => Promise<ReconciledTransaction[]>
  /**
   * Async Callback to Save imported Transactions
   *
   * @param transactions  An array of user reviewed reconciled transactions to import
   */
  onComplete: (transactions: ReconciledTransaction[]) => Promise<void>
}
