import Grid from '@mui/material/Grid'
import { Controller, useForm } from 'react-hook-form'

import { AutocompleteField } from '@/components/forms/AutocompleteField'
import { CategoryField } from '@/components/forms/CategoryField'
import { FileField } from '@/components/forms/FileField'
import { Step } from '@/components/Stepper'
import type { IAccount } from '@angelfish/core'
import { useTranslate } from '@/utils/i18n'

/**
 * Step Component Properties
 */
export interface ImportTransactionsFileProps {
  /**
   * Full list of available Accounts for Categorising
   * Transactions in the Table with Parent Relations Attached
   */
  accountsWithRelations: IAccount[]
  /**
   * Default bank account to import transactions into
   */
  defaultAccount: IAccount
  /**
   * Error message to display
   */
  error?: string
  /**
   * Async Callback to open the file dialog. Returns the selected file(s) path(s)
   * or null if no file was selected.
   *
   * @param multiple Allow multiple files to be selected
   * @param fileTypes Optional set array of file extensions that can be selected (i.e. ['jpg', 'png']])
   */
  onOpenFileDialog: (multiple: boolean, fileTypes?: string[]) => Promise<string[] | string | null>
  /**
   * Callback when the next button is clicked. Returns file path
   * of selected file.
   */
  onNext: (file: string, delimiter: string) => void
}

/**
 * Step Component - 1. Select File to Import
 */
export default function ImportTransactionsFile({
  accountsWithRelations,
  defaultAccount,
  error,
  onOpenFileDialog,
  onNext,
}: ImportTransactionsFileProps) {
  const { ImportTransactions: t } = useTranslate('components.modals')
  const {
    control,
    getValues,
    watch,
    formState: { isValid },
  } = useForm<{ file: string; account: IAccount; csvDelimiter: string }>({
    defaultValues: { file: '', account: defaultAccount, csvDelimiter: ',' },
  })
  const filePathArray = watch('file')
  const filePath = filePathArray[0]
  const isCVSFile = filePath ? filePath?.toLowerCase().endsWith('.csv') : false

  return (
    <Step
      title={t['selectFileToImport']}
      nextStep={t['next']}
      isReady={isValid}
      onNext={() => onNext(getValues('file'), getValues('csvDelimiter'))}
    >
      <Grid container spacing={1}>
        <Grid size={12}>
          {error && <span style={{ color: 'red', fontWeight: 'bold' }}>{error}</span>}
          <Grid size={12}>
            <Controller
              name="file"
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, ...restField } }) => (
                <FileField
                  label={t['filePath']}
                  helperText={t['filePathHelper']}
                  multiple={false}
                  fileTypes={['ofx', 'qfx', 'qif', 'csv']}
                  required
                  onChange={(file: string | string[] | null) =>
                    onChange(file ? (file as string) : '')
                  }
                  onOpenFileDialog={onOpenFileDialog}
                  placeholder={t['selectFile']}
                  fullWidth
                  {...restField}
                />
              )}
            />
          </Grid>
        </Grid>
        {isCVSFile && (
          <Grid size={12}>
            <Grid container spacing={1}>
              <Grid size={6}>
                <Controller
                  name="account"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { onChange, ...restField } }) => (
                    <CategoryField
                      label={t['accountToImportInto']}
                      required
                      helperText={t['accountToImportIntoHelper']}
                      filter={(account) => account.class === 'ACCOUNT'}
                      disableGroupBy={true}
                      disableTooltip={true}
                      placeholder={t['searchBankAccounts']}
                      accountsWithRelations={accountsWithRelations}
                      onChange={(account) => {
                        if (account) onChange(account as IAccount)
                      }}
                      fullWidth
                      {...restField}
                    />
                  )}
                />
              </Grid>
              <Grid size={6}>
                <Controller
                  name="csvDelimiter"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { onChange, ref, ...restField } }) => (
                    <AutocompleteField
                      label={t['csvDelimiter']}
                      autoFocus={false}
                      required={true}
                      freeSolo={false}
                      options={[',', ';']}
                      fullWidth={true}
                      placeholder={t['csvDelimiterHelper']}
                      formRef={ref}
                      onChange={(_, value) => {
                        if (value !== null) {
                          onChange(value as ',' | ';')
                        }
                      }}
                      {...restField}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>
        )}
      </Grid>
    </Step>
  )
}
