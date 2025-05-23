import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import React from 'react'
import type { Control, FieldArrayWithId, UseFormGetValues } from 'react-hook-form'
import { Controller } from 'react-hook-form'

import { CategoryField } from '@/components/forms/CategoryField'
import type { IAccount, ParsedFileMappings } from '@angelfish/core'
import type { ImportMapperForm } from './ImportTransactions-Mapping'

/**
 * Step Component Properties
 */
export interface ImportDefaultTransactionsMappingProps {
  /**
   * Full list of available Accounts for Categorising
   * Transactions in the Table with Parent Relations Attached
   */
  accountsWithRelations: IAccount[]
  /**
   * Error message to display
   */
  error?: string
  /**
   * Form Controller for React Hook Form
   */
  formController: Control<ImportMapperForm>
  /**
   * Parsed File Mappings
   */
  fileMappings: ParsedFileMappings
  /**
   * Accounts Mapper Fields
   */
  accountsMapperFields: FieldArrayWithId<ImportMapperForm, 'accountsMapper', 'id'>[]
  /**
   * Categories Mapper Fields
   */
  categoriesMapperFields: FieldArrayWithId<ImportMapperForm, 'categoriesMapper', 'id'>[]
  /**
   * Get Values from React Hook Form
   */
  getValues: UseFormGetValues<ImportMapperForm>
}

/**
 * Step Component - 2. Default Form to map fields to Transaction Fields if file is not a CSV
 */
export default function ImportDefaultTransactionsMapping({
  accountsWithRelations,
  error,
  formController,
  fileMappings,
  accountsMapperFields,
  categoriesMapperFields,
  getValues,
}: ImportDefaultTransactionsMappingProps) {
  // Component State
  const [openTabIndex, setOpenTabIndex] = React.useState(0)
  const accountsScrollDiv = React.useRef<HTMLDivElement>(null)
  const categoriesScrollDiv = React.useRef<HTMLDivElement>(null)

  // Make sure fields are scrolled to top when headers are loaded
  React.useEffect(() => {
    if (accountsScrollDiv.current) {
      accountsScrollDiv.current.scrollTop = 0
    }
    if (categoriesScrollDiv.current) {
      categoriesScrollDiv.current.scrollTop = 0
    }
  }, [fileMappings])

  // Render CSV Mapper Form
  return (
    <React.Fragment>
      <Box sx={{ marginBottom: 2 }}>
        {error && (
          <p>
            <span style={{ color: 'red', fontWeight: 'bold' }}>
              There was an error parsing your file: {error}
            </span>
          </p>
        )}
        <p>
          Map the {fileMappings.fileType.toUpperCase()} properties below to import your Transactions
          correctly:
        </p>
      </Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={openTabIndex}
          onChange={(_, newValue: number) => {
            setOpenTabIndex(newValue)
          }}
          aria-label="Mappings Tabs"
        >
          <Tab
            label={
              accountsMapperFields && accountsMapperFields.length > 1
                ? `Accounts (${fileMappings.accounts?.length || 0})`
                : 'Account'
            }
            id="tab-0"
            aria-controls="tabpanel-0"
            disableRipple
          />
          <Tab
            label={`Categories (${fileMappings.categories?.length || 0})`}
            id="tab-1"
            aria-controls="tabpanel-1"
            disableRipple
            disabled={fileMappings.categories === undefined || fileMappings.categories.length === 0}
          />
        </Tabs>
        <Box
          role="tabpanel"
          hidden={openTabIndex !== 0}
          id="tabpanel-0"
          aria-labelledby="tab-0"
          ref={accountsScrollDiv}
          sx={{
            height: 250,
            overflowY: 'auto',
            marginBottom: 1,
            marginLeft: -1,
            backgroundColor: (theme) => theme.palette.grey[200],
          }}
          padding={1}
        >
          {accountsMapperFields && accountsMapperFields.length > 1 ? (
            <Grid container spacing={2}>
              {accountsMapperFields.map((accountField, index) => (
                <React.Fragment key={accountField.id}>
                  <Grid size={12}>
                    <Controller
                      name={`accountsMapper.${index}.value` as any}
                      control={formController}
                      rules={{ required: true }}
                      render={({ field: { onChange, value, ...restField } }) => (
                        <CategoryField
                          label={accountField.name}
                          required
                          error={value === undefined}
                          helperText="Select the bank account to import transactions into."
                          filter={(account) => account.class === 'ACCOUNT'}
                          filterOptions={(options, _) => {
                            const selectedAccounts: number[] = getValues('accountsMapper').reduce(
                              (acc, { value }) => {
                                if (value) {
                                  acc.push(value)
                                }
                                return acc
                              },
                              [] as number[],
                            )
                            return options.filter(
                              (account) => !selectedAccounts.includes(account.id),
                            )
                          }}
                          disableGroupBy={true}
                          disableTooltip={true}
                          placeholder="Search Bank Accounts..."
                          margin="none"
                          accountsWithRelations={accountsWithRelations}
                          onChange={(account) => {
                            if (account) {
                              onChange((account as IAccount).id)
                            } else {
                              onChange(undefined)
                            }
                          }}
                          value={
                            value
                              ? accountsWithRelations.find((account) => account.id === value)
                              : null
                          }
                          fullWidth
                          {...restField}
                        />
                      )}
                    />
                  </Grid>
                </React.Fragment>
              ))}
            </Grid>
          ) : (
            <Grid container spacing={2}>
              <Grid size={12}>
                <Controller
                  name="defaultAccountId"
                  control={formController}
                  rules={{ required: true }}
                  render={({ field: { onChange, value, ...restField } }) => (
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
                        if (account) onChange((account as IAccount).id)
                      }}
                      value={
                        value
                          ? accountsWithRelations.find((account) => account.id === value)
                          : undefined
                      }
                      fullWidth
                      {...restField}
                    />
                  )}
                />
              </Grid>
            </Grid>
          )}
        </Box>
        <Box
          role="tabpanel"
          hidden={openTabIndex !== 1}
          id="tabpanel-1"
          aria-labelledby="tab-1"
          ref={categoriesScrollDiv}
          sx={{
            height: 250,
            overflowY: 'auto',
            marginBottom: 1,
            marginLeft: -1,
            backgroundColor: (theme) => theme.palette.grey[200],
          }}
          padding={1}
        >
          <Grid container spacing={2}>
            {categoriesMapperFields && categoriesMapperFields.length > 0 ? (
              <React.Fragment>
                {categoriesMapperFields.map((categoryField, index) => (
                  <React.Fragment key={categoryField.id}>
                    <Grid size={4}>
                      <strong>{categoryField.key}</strong>
                    </Grid>
                    <Grid size={8}>
                      <Controller
                        name={`categoriesMapper.${index}.value` as any}
                        control={formController}
                        rules={{ required: false }}
                        render={({ field: { onChange, value, ...restField } }) => (
                          <CategoryField
                            error={value === undefined}
                            placeholder="Search Categories..."
                            margin="none"
                            accountsWithRelations={accountsWithRelations}
                            onChange={(account) => {
                              if (account) {
                                onChange((account as IAccount).id)
                              } else {
                                onChange(undefined)
                              }
                            }}
                            value={
                              value
                                ? accountsWithRelations.find((account) => account.id === value)
                                : null
                            }
                            fullWidth
                            {...restField}
                          />
                        )}
                      />
                    </Grid>
                  </React.Fragment>
                ))}
              </React.Fragment>
            ) : null}
          </Grid>
        </Box>
      </Box>
    </React.Fragment>
  )
}
