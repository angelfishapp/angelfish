import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import React from 'react'
import { useFieldArray, useForm } from 'react-hook-form'

import { Step } from '@/components/Stepper'
import { useTranslate } from '@/utils/i18n'
import type {
  CSVTransactionMapper,
  IAccount,
  ImportFileType,
  ImportTransactionsMapper,
  ParsedFileMappings,
} from '@angelfish/core'
import ImportCSVTransactionsMapping from './ImportTransactions-Mapping.csv'
import ImportDefaultTransactionsMapping from './ImportTransactions-Mapping.default'

/**
 * Import Mapping Form Fields
 */
export type ImportMapperForm = {
  fileType: ImportFileType
  defaultAccountId: number
  accountsMapper: [{ key: string; name: string; value?: number }]
  categoriesMapper: [{ key: string; value?: number }]
  csvMapper: CSVTransactionMapper
}

/**
 * Step Component Properties
 */
export interface ImportTransactionsMappingProps {
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
   * Error message to display
   */
  error?: string
  /**
   * Parsed File Mappings
   */
  fileMappings?: ParsedFileMappings
  /**
   * Callback when the next button is clicked. Returns file path
   * of selected file.
   */
  onNext: (mapper: ImportTransactionsMapper) => void
}

/**
 * Step Component - 2. Map CSV Headers to Transaction Fields. This step is only shown if
 * importing a CSV file, otherwise it is skipped. Will show loading spinner if headers is undefined.
 */
export default function ImportTransactionsMapping({
  accountsWithRelations,
  defaultAccount,
  error,
  fileMappings,
  onNext,
}: ImportTransactionsMappingProps) {
  const { ImportTransactions: t } = useTranslate('components.modals')
  // Setup Form
  const {
    control,
    getValues,
    formState: { isValid },
  } = useForm<ImportMapperForm>({
    defaultValues: {
      fileType: 'csv',
      defaultAccountId: defaultAccount.id,
      accountsMapper: [],
      categoriesMapper: [],
      csvMapper: {
        fields: {
          date: '',
          name: '',
          memo: '',
          amount: '',
          pending: '',
          check_number: '',
        },
        settings: {
          date_format: 'MM DD YY',
          csv_delimiter: ',',
        },
      },
    },
  })

  const {
    fields: accountsMapperFields,
    append: accountsMapperFieldAppend,
    remove: accountsMapperFieldRemove,
  } = useFieldArray({
    control,
    name: 'accountsMapper',
  })

  const {
    fields: categoriesMapperFields,
    append: categoriesMapperFieldAppend,
    remove: categoriesMapperFieldRemove,
  } = useFieldArray({
    control,
    name: 'categoriesMapper',
  })

  /**
   * Update Form Fields when File Mappings are loaded
   */
  React.useEffect(() => {
    if (fileMappings === undefined) return

    // Update Accounts Mapper Fields
    accountsMapperFieldRemove()
    if (fileMappings.accounts && fileMappings.accounts.length > 0) {
      fileMappings.accounts.forEach((account) =>
        accountsMapperFieldAppend({
          key: account.id,
          name: account.name,
          value: undefined,
        }),
      )
    }

    // Update Categories Mapper Fields
    categoriesMapperFieldRemove()
    if (fileMappings.categories && fileMappings.categories.length > 0) {
      fileMappings.categories.forEach((category) =>
        categoriesMapperFieldAppend({
          key: category,
          value: undefined,
        }),
      )
    }
  }, [
    fileMappings,
    accountsMapperFieldAppend,
    categoriesMapperFieldAppend,
    accountsMapperFieldRemove,
    categoriesMapperFieldRemove,
  ])

  // Render Step
  return (
    <Step
      title={t['confirmMappings']}
      nextStep={t['next']}
      isReady={isValid}
      onNext={() => {
        onNext({
          fileType: fileMappings?.fileType ?? 'csv',
          defaultAccountId: defaultAccount.id,
          accountsMapper: getValues('accountsMapper').reduce(
            (acc: Record<string, number>, { key, value }) => {
              if (value) {
                acc[key] = value
              }
              return acc
            },
            {},
          ),
          categoriesMapper: getValues('categoriesMapper').reduce(
            (acc: Record<string, number>, { key, value }) => {
              if (value) {
                acc[key] = value
              }
              return acc
            },
            {},
          ),
          csvMapper: getValues('csvMapper'),
        })
      }}
    >
      {fileMappings === undefined ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      ) : (
        <React.Fragment>
          {fileMappings.fileType === 'csv' ? (
            <ImportCSVTransactionsMapping
              error={error}
              formController={control}
              fileMappings={fileMappings}
              getValues={getValues}
            />
          ) : (
            <ImportDefaultTransactionsMapping
              accountsWithRelations={accountsWithRelations}
              error={error}
              formController={control}
              fileMappings={fileMappings}
              accountsMapperFields={accountsMapperFields}
              categoriesMapperFields={categoriesMapperFields}
              getValues={getValues}
            />
          )}
        </React.Fragment>
      )}
    </Step>
  )
}
