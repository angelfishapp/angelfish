import { Grid, Typography } from '@mui/material'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'

import { AvatarField } from '@/components/forms/AvatarField'
import { TextField } from '@/components/forms/TextField'
import { Step } from '@/components/Stepper'
import type { IAuthenticatedUser } from '@angelfish/core'

/**
 * Form Properties
 */
type UserSettingsFormValues = {
  avatar?: string
  firstName: string
  lastName: string
  email: string
}

/**
 * Component Properties
 */
export interface SetupUserStepProps {
  /**
   * List of Base64 Encoded User Avatars to display on Avatar Picker
   */
  userAvatars: string[]
  /**
   * The current user logged in
   */
  authenticatedUser: IAuthenticatedUser
  /**
   * Next Step title to display in Complete Button at bottom
   * of panel
   */
  nextStep: string
  /**
   * Callback to update user and move to next step
   */
  onNext: (firstName: string, lastName: string, avatar?: string) => void
}

/**
 * Setup step to update user profile details
 */
export default function SetupUserStep({
  nextStep,
  onNext,
  authenticatedUser,
  userAvatars,
}: SetupUserStepProps) {
  // Component State
  const [firstTimeUser, setFirstTimeUser] = React.useState<boolean>(true)

  // Setup Form
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<UserSettingsFormValues>({
    mode: 'onBlur',
    defaultValues: {
      avatar: authenticatedUser?.avatar || userAvatars[0],
      firstName: authenticatedUser?.first_name || '',
      lastName: authenticatedUser?.last_name || '',
      email: authenticatedUser?.email,
    },
  })

  /**
   * Handle updating the User
   */
  const handleSave = async (formData: UserSettingsFormValues) => {
    onNext(formData.firstName, formData.lastName, formData.avatar)
    reset(formData)
  }

  /**
   * Determine if a first time user or existing user
   */
  React.useEffect(() => {
    if (authenticatedUser?.first_name && authenticatedUser?.last_name) {
      setFirstTimeUser(false)
    }
  }, [authenticatedUser])

  // Render
  return (
    <Step
      title="Your Personal Details"
      nextStep={nextStep}
      isReady={isValid}
      onNext={() => handleSubmit(handleSave)()}
    >
      <Grid container spacing={3} alignItems="center" justifyContent="flex-start">
        <Grid item xs={12}>
          <Typography variant="body1">
            {firstTimeUser ? (
              <React.Fragment>
                Welcome! As this is your first trip below the surface, we&apos;ll need your personal
                details before you enter:
              </React.Fragment>
            ) : (
              <React.Fragment>
                Welcome back! First, lets confirm your personal details below:
              </React.Fragment>
            )}
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Controller
            name="avatar"
            control={control}
            rules={{ required: false }}
            render={({ field }) => (
              <AvatarField
                label="User Avatar"
                avatars={userAvatars}
                size={100}
                error={errors?.avatar ? true : false}
                helperText={errors?.avatar ? 'Invalid User Avatar' : undefined}
                {...field}
              />
            )}
          />
        </Grid>
        <Grid item xs={3}>
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
                helperText={errors?.firstName ? 'First Name is required' : ' '}
                {...field}
              />
            )}
          />
        </Grid>
        <Grid item xs={3}>
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
                helperText={errors?.lastName ? 'Last Name is required' : ' '}
                {...field}
              />
            )}
          />
        </Grid>
      </Grid>
    </Step>
  )
}
