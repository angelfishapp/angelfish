import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'

import { AvatarField } from '@/components/forms/AvatarField'
import { TextField } from '@/components/forms/TextField'
import { Step } from '@/components/Stepper'
import { useTranslate } from '@/utils/i18n'
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
  const { setupScreen: t } = useTranslate('screens')
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
      title={t['personalDetails']}
      nextStep={nextStep}
      isReady={isValid}
      onNext={() => handleSubmit(handleSave)()}
    >
      <Grid container spacing={3} alignItems="center" justifyContent="flex-start">
        <Grid size={12}>
          <Typography variant="body1">
            {firstTimeUser ? (
              <React.Fragment>{t['welcome']}</React.Fragment>
            ) : (
              <React.Fragment>{t['confirm']}</React.Fragment>
            )}
          </Typography>
        </Grid>
        <Grid size={3}>
          <Controller
            name="avatar"
            control={control}
            rules={{ required: false }}
            render={({ field }) => (
              <AvatarField
                label={t['userAvatar']}
                avatars={userAvatars}
                size={100}
                error={errors?.avatar ? true : false}
                helperText={errors?.avatar ? t['invalidUserAvatar'] : undefined}
                {...field}
              />
            )}
          />
        </Grid>
        <Grid size={3}>
          <Controller
            name="firstName"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                label={t['firstName']}
                placeholder={t['enterFirstName']}
                fullWidth
                required
                error={errors?.firstName ? true : false}
                helperText={errors?.firstName ? t['firstNameRequired'] : ' '}
                {...field}
              />
            )}
          />
        </Grid>
        <Grid size={3}>
          <Controller
            name="lastName"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                label={t['lastName']}
                placeholder={t['enterLastName']}
                fullWidth
                required
                error={errors?.lastName ? true : false}
                helperText={errors?.lastName ? t['lastNameRequired'] : ' '}
                {...field}
              />
            )}
          />
        </Grid>
      </Grid>
    </Step>
  )
}
