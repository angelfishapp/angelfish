import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import { Step } from '@/components/Stepper'
import { UserTableUIContainer } from '@/components/UserTable'
import type { IAuthenticatedUser, IUser } from '@angelfish/core'

/**
 * Component Properties
 */
export interface SetupMembersStepProps {
  /**
   * Next Step title to display in Complete Button at bottom
   * of panel
   */
  nextStep: string
  /**
   * Callback to send invites and move to next step
   */
  onNext: () => void
  /**
   * Current Authenticated User
   */
  authenticatedUser: IAuthenticatedUser
  /**
   * List of Base64 Encoded User Avatars to display on Avatar Picker
   */
  userAvatars: string[]
  /**
   * List of Users in the Database
   */
  users: IUser[]
  /**
   * Callback function to delete an existing User
   */
  onDeleteUser: (user: IUser) => void
  /*
   * Callback function to edit a User
   */
  onSaveUser: (user: IUser) => void
}

/**
 * Step to review and add other Members to the Household so they can be assigned
 * as owners of Bank Accounts and have their own income and expenses.
 */
export default function SetupMembersStep({
  nextStep,
  onNext,
  authenticatedUser,
  userAvatars,
  users,
  onDeleteUser,
  onSaveUser,
}: SetupMembersStepProps) {
  // Render
  return (
    <Step title="Add Household Members" nextStep={nextStep} isReady={true} onNext={onNext}>
      <Grid container spacing={2} alignItems="center" justifyContent="flex-start">
        <Grid size={12}>
          <Typography variant="body1">
            Optionally add other people to your Household such as your partner so you can assign
            Bank Accounts to them and break down income and expenses by different members of your
            Household.
          </Typography>
        </Grid>
        <Grid size={12}>
          <UserTableUIContainer
            avatars={userAvatars}
            users={users}
            authenticated_user_id={authenticatedUser.id}
            onSave={onSaveUser}
            onDelete={onDeleteUser}
          />
        </Grid>
      </Grid>
    </Step>
  )
}
