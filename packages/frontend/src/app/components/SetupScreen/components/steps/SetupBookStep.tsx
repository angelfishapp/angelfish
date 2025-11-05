import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'

import { AvatarField } from '@/components/forms/AvatarField'
import { CountryField } from '@/components/forms/CountryField'
import { CurrencyField } from '@/components/forms/CurrencyField'
import { TextField } from '@/components/forms/TextField'
import { Step } from '@/components/Stepper'
import { getCountryFromCode, getCurrencyFromCode } from '@angelfish/core'

/**
 * Form Properties
 */
type BookFormFields = {
  logo?: string
  name: string
  country: string
  currency: string
}

/**
 * Component Properties
 */
export interface SetupBookStepProps {
  /**
   * Next Step title to display in Complete Button at bottom
   * of panel
   */
  nextStep: string
  /**
   * Callback to create or load Book and move to next step
   */
  onNext: (name: string, country: string, currency: string, logo?: string) => Promise<void>
  /**
   * List of out of the box Base64 encoded Book Avatars for User to Select
   * during Setup
   */
  bookAvatars: string[]
  /**
   * A suggested name for the new Book (Optional)
   */
  suggestedName?: string
}

/**
 * Displays a Step Panel with form for user open or create a new Book for their Household/Business
 * For now, if the user already has a Cloud Account, will force User to use that account so they can't
 * create multiple Accounts for now
 */
export default function SetupBookStep({
  nextStep,
  onNext,
  bookAvatars,
  suggestedName,
}: SetupBookStepProps) {
  // Setup Form
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm<BookFormFields>({
    mode: 'onBlur',
    defaultValues: {
      logo: bookAvatars[0],
      name: suggestedName,
      country: undefined,
      currency: undefined,
    },
  })

  // Make sure suggestedName is set in the form when it changes
  React.useEffect(() => {
    setValue('name', suggestedName ?? '')
  }, [suggestedName, setValue])

  /**
   * Handle saving the Book
   */
  const handleSave = async (formData: BookFormFields) => {
    onNext(formData.name, formData.country, formData.currency, formData.logo)
    reset(formData)
  }

  // Render
  return (
    <Step
      title="Setup Your Household"
      nextStep={nextStep}
      isReady={isValid}
      onNext={async () => handleSubmit(handleSave)()}
    >
      <Grid container spacing={2} alignItems="center" justifyContent="flex-start">
        <Grid size={12}>
          <Typography variant="body1">
            Your Household is your private underwater home where you and your household members can
            track all your finances in one place.
          </Typography>
        </Grid>
        <Grid size={12}>
          <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start">
            <Grid size={2} marginLeft={1}>
              <Controller
                name="logo"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <AvatarField
                    label="Logo"
                    avatars={bookAvatars}
                    size={100}
                    dialogSize={100}
                    dialogTitle="Select a Logo for your Household"
                    required
                    error={errors?.logo ? true : false}
                    helperText={errors?.logo ? 'Logo is required' : ' '}
                    {...field}
                  />
                )}
              />
            </Grid>
            <Grid size={9}>
              <Grid size={12}>
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
                      helperText={errors?.name ? 'Household Name is required' : ' '}
                      {...field}
                    />
                  )}
                />
              </Grid>
              <Grid size={12}>
                <Grid container spacing={2}>
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
                          value={value ? (getCountryFromCode(value) ?? undefined) : undefined}
                          onChange={(country) => {
                            if (country) {
                              onChange(country.code)
                              setValue('currency', country.currency, {
                                shouldDirty: true,
                                shouldValidate: true,
                              })
                            } else {
                              onChange('')
                            }
                          }}
                          error={errors?.country ? true : false}
                          helperText={errors?.country ? 'Country is required' : ' '}
                          {...rest}
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={6}>
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
                          value={value ? (getCurrencyFromCode(value) ?? undefined) : undefined}
                          onChange={(currency) => {
                            if (currency) {
                              onChange(currency.code)
                            } else {
                              onChange('')
                            }
                          }}
                          error={errors?.currency ? true : false}
                          helperText={errors?.currency ? 'Currency is required' : ' '}
                          {...rest}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Step>
  )
}
