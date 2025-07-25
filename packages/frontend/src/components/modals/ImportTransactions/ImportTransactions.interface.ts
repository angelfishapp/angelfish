import type {
  IAccount,
  ImportTransactionsMapper,
  ITag,
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
   *list of Tags Avalilable to ues
   */
  tags?: ITag[]
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
   * @returns         ParsedFileMappings
   */
  onGetFileMappings: (file: string, delimiter?: string) => Promise<ParsedFileMappings>
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
