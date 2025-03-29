import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { Controller, useForm } from 'react-hook-form'

import { AvatarField } from '@/components/forms/AvatarField'
import { CountryField } from '@/components/forms/CountryField'
import { CurrencyField } from '@/components/forms/CurrencyField'
import { TextField } from '@/components/forms/TextField'
import type { IBook } from '@angelfish/core'
import { BOOK_AVATARS } from '@angelfish/core'
import { getCountryFromCode } from '@angelfish/core/src/data/countries'
import { getCurrencyFromCode } from '@angelfish/core/src/data/currencies'

/**
 * Form Properties
 */

type BookFormFields = {
  logo: string
  name: string
  country: string
  currency: string
}

/**
 * BookForm Properties
 */
export interface BookFormProps {
  /*
   * The current book open
   */
  book: IBook
  /*
   * Callback function to save the book
   */
  onSave: (book: IBook) => void
}

/**
 * Book Information Form
 */
export default function BookForm({ book, onSave }: BookFormProps) {
  // Setup Form
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isValid, isDirty },
  } = useForm<BookFormFields>({
    mode: 'onBlur',
    defaultValues: {
      logo: book.logo,
      name: book.name,
      country: book.country,
      currency: book.default_currency,
    },
  })

  /**
   * Handle saving the Book
   */
  const handleSave = async (formData: BookFormFields) => {
    const updatedBook = structuredClone(book)
    updatedBook.logo = formData.logo
    updatedBook.name = formData.name
    updatedBook.country = formData.country
    updatedBook.default_currency = formData.currency
    onSave(updatedBook)
    reset(formData)
  }

  // Render
  return (
    <Box marginBottom={2}>
      <Paper>
        <Typography variant="h5" gutterBottom={true}>
          Household Information
        </Typography>

        <Grid container spacing={2}>
          <Grid size={2}>
            <Controller
              name="logo"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <AvatarField
                  avatars={BOOK_AVATARS}
                  size={100}
                  required
                  error={errors?.logo ? true : false}
                  helperText={errors?.logo ? 'Logo is required' : undefined}
                  {...field}
                />
              )}
            />
          </Grid>
          <Grid size={10}>
            <Grid
              container
              spacing={1}
              direction="row"
              justifyContent="flex-start"
              alignItems="flex-start"
            >
              <Grid size={6}>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField
                      label="Name"
                      placeholder="Enter a Name for your Household"
                      fullWidth
                      required
                      error={errors?.name ? true : false}
                      helperText={errors?.name ? 'Household Name is required' : undefined}
                      {...field}
                    />
                  )}
                />
              </Grid>
              <Grid size={6}>
                <Controller
                  name="country"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, ...rest } }) => (
                    <CountryField
                      label="Country"
                      fullWidth
                      required
                      value={getCountryFromCode(value) ?? undefined}
                      onChange={(country) => {
                        if (country) {
                          onChange(country.code)
                          setValue('currency', country.currency, {
                            shouldDirty: true,
                            shouldValidate: true,
                          })
                        }
                      }}
                      {...rest}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Grid container spacing={1}>
              <Controller
                name="currency"
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { value, onChange, ...rest } }) => (
                  <CurrencyField
                    label="Default Currency"
                    fullWidth
                    required
                    value={getCurrencyFromCode(value) ?? undefined}
                    onChange={(currency) => {
                      if (currency) {
                        onChange(currency.code)
                      }
                    }}
                    {...rest}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Grid>

        <Box display="flex" justifyContent="flex-end" marginTop={2}>
          <Button
            variant="contained"
            onClick={() => handleSubmit(handleSave)()}
            disabled={!isValid || !isDirty}
          >
            Update
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}
