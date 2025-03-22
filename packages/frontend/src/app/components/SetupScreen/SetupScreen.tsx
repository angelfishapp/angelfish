import { Box } from '@mui/material'
import React from 'react'

import { Step, Stepper } from '@/components/Stepper'
import {
  SetupBankAccountsStep,
  SetupBookStep,
  SetupEncryptionStep,
  SetupMembersStep,
  SetupUserStep,
} from './components/steps'
import type { SetupScreenProps } from './SetupScreen.interface'

/**
 * Main Component - Onboarding workflow for new user setting up App for the first
 * time.
 *
 * NOTE: Breaking overall App pattern and putting dispatchers/IPC calls in this
 * component for convenience so its not stateless.
 */

export default function SetupScreen({
  authenticatedUser,
  book,
  bookAvatars,
  userAvatars,
  users,
  accountsWithRelations,
  institutions,
  onUpdateAuthenticatedUser,
  onCreateBook,
  onCreateEncryptionKey,
  onDeleteUser,
  onSaveUser,
  onDeleteAccount,
  onDeleteInstitution,
  onSearchInstitutions,
  onSaveAccount,
  onSaveInstitution,
  onComplete,
}: SetupScreenProps) {
  // Component State
  const [activeStep, setActiveStep] = React.useState<number>(1)
  const [isOpen, setIsOpen] = React.useState<boolean>(true)

  /**
   * Update User and move to next step if successful
   */
  const updateAuthenticatedUser = (firstName: string, lastName: string, avatar?: string) => {
    onUpdateAuthenticatedUser(firstName, lastName, avatar)
    setActiveStep(2)
  }

  /**
   * Callback to setup a new or existing Book from local file
   */
  const createBook = async (name: string, country: string, currency: string, logo?: string) => {
    try {
      await onCreateBook(name, country, currency, logo)
      setActiveStep(3)
    } catch (_error) {
      // TODO: Handle Error
    }
  }

  return (
    <Box width="100%" height="100%" justifyContent="center" alignContent="center" display="flex">
      <Stepper
        activeStep={activeStep}
        labels={['Profile', 'Household', 'Encryption', 'Members', 'Accounts', 'Intro']}
        open={isOpen}
        onTransitionEnd={() => onComplete()}
      >
        <SetupUserStep
          nextStep="Next - Create Your Household"
          onNext={updateAuthenticatedUser}
          authenticatedUser={authenticatedUser}
          userAvatars={userAvatars}
        />
        <SetupBookStep
          nextStep="Next - Setup Encryption Keys"
          onNext={createBook}
          bookAvatars={bookAvatars}
          suggestedName={`The ${authenticatedUser.last_name} Household`}
        />
        <SetupEncryptionStep
          nextStep="Next - Setup Your Members"
          onNext={(seed) => {
            onCreateEncryptionKey(seed)
            setActiveStep(4)
          }}
        />
        <SetupMembersStep
          nextStep="Next - Setup Your Bank Accounts"
          onNext={() => setActiveStep(5)}
          authenticatedUser={authenticatedUser}
          userAvatars={userAvatars}
          users={users}
          onDeleteUser={onDeleteUser}
          onSaveUser={onSaveUser}
        />
        <SetupBankAccountsStep
          nextStep="Next - Short Intro"
          onNext={() => setActiveStep(6)}
          accountsWithRelations={accountsWithRelations}
          book={book}
          institutions={institutions}
          users={users}
          onSaveAccount={onSaveAccount}
          onDeleteAccount={onDeleteAccount}
          onSaveInstitution={onSaveInstitution}
          onDeleteInstitution={onDeleteInstitution}
          onSearchInstitutions={onSearchInstitutions}
        />
        <Step
          title="Woohoo! You're Ready To Get Started!"
          nextStep="Finish"
          isReady={true}
          onNext={() => setIsOpen(false)}
        >
          <p>Coming Soon - an amazing video intro to onboard new users!</p>
        </Step>
      </Stepper>
    </Box>
  )
}
