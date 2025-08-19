import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import React from 'react'
import type { Control, UseFormGetValues } from 'react-hook-form'
import { Controller } from 'react-hook-form'

import { AutocompleteField } from '@/components/forms/AutocompleteField'
import { useTranslate } from '@/utils/i18n'
import type { ParsedFileMappings } from '@angelfish/core'
import { MapperHeading } from '../../ImportTransactions.styled'
import type { ImportMapperForm } from './ImportTransactions-Mapping'

/**
 * Array of tuples of TransactionMapper fields that can be selected
 */
const TransactionMapperFields = [
  { name: 'date', label: 'date', required: true },
  { name: 'name', label: 'name', required: true },
  { name: 'amount', label: 'amount', required: true },
  { name: 'memo', label: 'memo', required: false },
  { name: 'pending', label: 'isPending', required: false },
  { name: 'check_number', label: 'checkNumber', required: false },
]

/**
 * Step Component Properties
 */
export interface ImportCSVTransactionsMappingProps {
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
   * Get Values from React Hook Form
   */
  getValues: UseFormGetValues<ImportMapperForm>
}

/**
 * Step Component - 2. CSV Form to map fields to Transaction Fields if file is a CSV
 */
export default function ImportCSVTransactionsMapping({
  error,
  formController,
  fileMappings,
  getValues,
}: ImportCSVTransactionsMappingProps) {
  const { ImportTransactions: t } = useTranslate('components.modals')
  const scrollDiv = React.useRef<HTMLDivElement>(null)

  // Make sure fields are scrolled to top when headers are loaded
  React.useEffect(() => {
    if (scrollDiv.current) {
      scrollDiv.current.scrollTop = 0
    }
  }, [fileMappings])

  // Render CSV Mapper Form
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid size={12}>
          {error && <span style={{ color: 'red', fontWeight: 'bold' }}>{error}</span>}
          {t['mapCSVHeaders']}
        </Grid>
        <Grid size={3}>
          <MapperHeading>{t['transactionFields']}</MapperHeading>
        </Grid>
        <Grid size={9}>
          <MapperHeading>{t['csvColumn']}</MapperHeading>
        </Grid>
      </Grid>
      <Grid
        container
        spacing={2}
        sx={{
          height: 250,
          overflowY: 'auto',
          marginBottom: 1,
          marginLeft: -1,
          backgroundColor: (theme) => theme.palette.grey[200],
        }}
        ref={scrollDiv}
      >
        {TransactionMapperFields.map((mapperField) => (
          <React.Fragment key={mapperField.name}>
            <Grid size={3}>
              <strong>{t[mapperField.label]}</strong>
            </Grid>
            <Grid size={8}>
              <Controller
                name={
                  `csvMapper.fields.${mapperField.name}` as
                    | 'csvMapper.fields.check_number'
                    | 'csvMapper.fields.id'
                    | 'csvMapper.fields.date'
                    | 'csvMapper.fields.name'
                    | 'csvMapper.fields.amount'
                    | 'csvMapper.fields.memo'
                    | 'csvMapper.fields.pending'
                    | 'csvMapper.fields.iso_currency_code'
                    | 'csvMapper.fields.transaction_type'
                }
                control={formController}
                rules={{ required: mapperField.required }}
                render={({ field: { onChange, value, ref, name, ...restField } }) => (
                  <AutocompleteField
                    id={name}
                    required={mapperField.required}
                    freeSolo={false}
                    options={fileMappings.csvHeaders || []}
                    fullWidth={true}
                    placeholder={mapperField.required ? t['selectColumn'] : t['skip']}
                    value={
                      (fileMappings.csvHeaders || []).find((header) => header.header === value) ??
                      null
                    }
                    formRef={ref}
                    onChange={(_, value) => {
                      onChange(value?.header ?? '')
                    }}
                    filterOptions={(options, params) => {
                      // Filter out options used on other fields
                      const usedOptions = Object.values(
                        getValues().csvMapper?.fields as Record<string, string>,
                      )
                      return options.filter(
                        (option) =>
                          option.header.toLowerCase().includes(params.inputValue.toLowerCase()) &&
                          !usedOptions.includes(option.header),
                      )
                    }}
                    getOptionLabel={(option) => option.header}
                    renderOption={(props, option) => {
                      const { key, ...rest } = props
                      if (option) {
                        return (
                          <ListItem key={key} {...rest}>
                            <ListItemText
                              primary={option.header}
                              secondary={option.samples.join(', ')}
                            />
                          </ListItem>
                        )
                      }
                    }}
                    {...restField}
                  />
                )}
              />
            </Grid>
          </React.Fragment>
        ))}
      </Grid>
      <Grid container spacing={0} sx={{ marginBottom: 3 }}>
        <Grid size={12}>
          <MapperHeading>{t['importSettings']}</MapperHeading>
        </Grid>
        <Grid size={2}>
          <strong>{t['dateFormat']}</strong>
        </Grid>
        <Grid size={4} sx={{ paddingRight: 3 }}>
          <Controller
            name="csvMapper.settings.date_format"
            control={formController}
            rules={{ required: true }}
            render={({ field: { onChange, ref, ...restField } }) => (
              <AutocompleteField
                required={true}
                freeSolo={false}
                options={[
                  'YYYY MM DD',
                  'YY MM DD',
                  'MM DD YYYY',
                  'MM DD YY',
                  'DD MM YYYY',
                  'DD MM YY',
                ]}
                fullWidth={true}
                placeholder={t['selectDateFormat']}
                formRef={ref}
                onChange={(_, value) => {
                  if (value !== null) {
                    onChange(
                      value as
                        | 'YYYY MM DD'
                        | 'YY MM DD'
                        | 'MM DD YYYY'
                        | 'MM DD YY'
                        | 'DD MM YYYY'
                        | 'DD MM YY',
                    )
                  }
                }}
                {...restField}
              />
            )}
          />
        </Grid>
        <Grid size={2}>
          <strong>{t['csvDelimiterRequired']}</strong>
        </Grid>
        <Grid size={4} sx={{ paddingRight: 3 }}>
          <Controller
            name="csvMapper.settings.csv_delimiter"
            control={formController}
            rules={{ required: true }}
            render={({ field: { onChange, ref, ...restField } }) => (
              <AutocompleteField
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
    </Box>
  )
}
