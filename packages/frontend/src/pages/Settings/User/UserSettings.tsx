import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'

import { AvatarField } from '@/components/forms/AvatarField'
import { PhoneField } from '@/components/forms/PhoneField'
import { TextField } from '@/components/forms/TextField'
import { selectAuthenticatedUser } from '@/redux/app/selectors'
import { updateAuthenticatedUser } from '@/redux/users/actions'
import { USER_AVATARS } from '@angelfish/core'

/**
 * Form Properties
 */

type UserSettingsFormValues = {
  avatar: string
  firstName: string
  lastName: string
  email: string
  phone: {
    number: string
    isValid: boolean
  }
}

/**
 * User Settings Page
 */

export default function UserSettings() {
  const dispatch = useDispatch()

  // Component State
  const authenticatedUser = useSelector(selectAuthenticatedUser)

  // Setup Form
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm<UserSettingsFormValues>({
    mode: 'onBlur',
    defaultValues: {
      avatar: authenticatedUser?.avatar,
      firstName: authenticatedUser?.first_name,
      lastName: authenticatedUser?.last_name,
      email: authenticatedUser?.email,
      phone: authenticatedUser?.phone
        ? { number: authenticatedUser?.phone.replace(/\+/g, ''), isValid: true }
        : { number: '', isValid: true },
    },
  })

  /*
   * Update default form values if currentUser changes
   */
  React.useEffect(() => {
    reset({
      avatar: authenticatedUser?.avatar,
      firstName: authenticatedUser?.first_name,
      lastName: authenticatedUser?.last_name,
      email: authenticatedUser?.email,
      phone: authenticatedUser?.phone
        ? { number: authenticatedUser?.phone.replace(/\+/g, ''), isValid: true }
        : { number: '', isValid: true },
    })
  }, [authenticatedUser, reset])

  /**
   * Handle updating the Authenticated User
   */
  const handleUserSave = async (formData: UserSettingsFormValues) => {
    if (authenticatedUser) {
      // Copy and update user
      dispatch(
        updateAuthenticatedUser({
          user: {
            ...authenticatedUser,
            avatar: formData.avatar,
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone.number ? `+${formData.phone.number}` : undefined,
          },
        }),
      )
      reset(formData)
    }
  }

  // Render
  return (
    <Box marginBottom={2}>
      <Paper>
        <Typography variant="h5" gutterBottom={true}>
          Personal Information
        </Typography>

        <Grid container spacing={2}>
          <Grid item sm={2}>
            <Controller
              name="avatar"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <AvatarField
                  avatars={USER_AVATARS}
                  size={100}
                  required
                  error={errors?.avatar ? true : false}
                  helperText={errors?.avatar ? 'Avatar is required' : undefined}
                  {...field}
                />
              )}
            />
          </Grid>
          <Grid item sm={10}>
            <form>
              <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start">
                <Grid container spacing={2}>
                  <Grid item sm={6}>
                    <Controller
                      name="firstName"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <TextField
                          label="First Name"
                          placeholder="Enter your First Name"
                          fullWidth
                          required
                          error={errors?.firstName ? true : false}
                          helperText={errors?.firstName ? 'First Name is required' : undefined}
                          {...field}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item sm={6}>
                    <Controller
                      name="lastName"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <TextField
                          label="Last Name"
                          placeholder="Enter your Last Name"
                          fullWidth
                          required
                          error={errors?.lastName ? true : false}
                          helperText={errors?.lastName ? 'Last Name is required' : undefined}
                          {...field}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid container spacing={1}>
                <Grid item sm={6}>
                  <Controller
                    name="email"
                    control={control}
                    rules={{
                      required: true,
                      pattern:
                        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    }}
                    render={({ field }) => (
                      <TextField
                        label="Email"
                        placeholder="Enter your Email"
                        disabled
                        fullWidth
                        required
                        error={errors?.email ? true : false}
                        helperText="COMING SOON: Email can't be changed right now..."
                        {...field}
                      />
                    )}
                  />
                </Grid>
                <Grid item sm={6}>
                  <Controller
                    name="phone"
                    control={control}
                    rules={{ required: false, validate: (value) => value.isValid }}
                    render={({ field: { onChange, value, ...restField } }) => (
                      <PhoneField
                        label="Phone Number"
                        fullWidth
                        error={errors?.phone ? true : false}
                        helperText={
                          errors?.phone
                            ? 'A valid phone number with country code is required'
                            : undefined
                        }
                        onChange={(phone, isValid) => {
                          onChange({
                            number: phone,
                            isValid,
                          })
                        }}
                        value={value.number}
                        {...restField}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>

        <Box display="flex" justifyContent="flex-end" marginTop={2}>
          <Button
            variant="contained"
            onClick={() => handleSubmit(handleUserSave)()}
            disabled={!isValid || !isDirty}
          >
            Update
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}
