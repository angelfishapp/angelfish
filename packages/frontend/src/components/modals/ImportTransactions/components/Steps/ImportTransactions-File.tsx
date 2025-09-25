import Grid from '@mui/material/Grid'
import { Controller, useForm } from 'react-hook-form'

import { AutocompleteField } from '@/components/forms/AutocompleteField'
import { CategoryField } from '@/components/forms/CategoryField'
import { FileField } from '@/components/forms/FileField'
import { Step } from '@/components/Stepper'
import type { IAccount } from '@angelfish/core'

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
      title="Select File to Import"
      nextStep="Next"
      isReady={isValid}
      onNext={() => onNext(getValues('file'), getValues('csvDelimiter'))}
    >
      <Grid container spacing={1}>
        <Grid size={12}>
          {error ? (
            <span style={{ color: 'red', fontWeight: 'bold' }}>{error}</span>
          ) : (
            <p>
              <strong>Note:</strong>{' '}
              <i>
                If you upload a PDF or image file, it will be processed on our Cloud service with
                AI. We do not keep any copy of your data but Google might. All other file types are
                processed locally. <strong>AI is experimental and may not be 100% accurate.</strong>
              </i>
            </p>
          )}
          <Grid size={12}>
            <Controller
              name="file"
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, ...restField } }) => (
                <FileField
                  label="File Path"
                  helperText="You can import from transactions from OFX, QFX, QIF, CSV, PDF, PNG, HEIC, JPEG files."
                  multiple={false}
                  fileTypes={[
                    'ofx',
                    'qfx',
                    'qif',
                    'csv',
                    'pdf',
                    'png',
                    'heic',
                    'heif',
                    'jpg',
                    'jpeg',
                  ]}
                  required
                  onChange={(file: string | string[] | null) =>
                    onChange(file ? (file as string) : '')
                  }
                  onOpenFileDialog={onOpenFileDialog}
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
                      label="Account to Import Into"
                      required
                      helperText="Select the bank account to import transactions into."
                      filter={(account) => account.class === 'ACCOUNT'}
                      disableGroupBy={true}
                      disableTooltip={true}
                      placeholder="Search Bank Accounts..."
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
                      label="CSV Delimiter"
                      autoFocus={false}
                      required={true}
                      freeSolo={false}
                      options={[',', ';']}
                      fullWidth={true}
                      placeholder="Select CSV Delimiter..."
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
