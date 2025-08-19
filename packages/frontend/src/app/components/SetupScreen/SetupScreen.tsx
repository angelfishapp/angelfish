import { Box } from '@mui/material'
import React from 'react'

import { Step, Stepper } from '@/components/Stepper'
import { VideoContainer } from '@/components/VideoContainer'
import { useTranslate } from '@/utils/i18n'
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
  const { setupScreen: t } = useTranslate('screens')
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
        labels={[
          t['profile'],
          t['household'],
          t['encryption'],
          t['members'],
          t['accounts'],
          t['intro'],
        ]}
        open={isOpen}
        onTransitionEnd={() => onComplete()}
      >
        <SetupUserStep
          nextStep={t['nextCreate']}
          onNext={updateAuthenticatedUser}
          authenticatedUser={authenticatedUser}
          userAvatars={userAvatars}
        />
        <SetupBookStep
          nextStep={t['nextSetup']}
          onNext={createBook}
          bookAvatars={bookAvatars}
          suggestedName={`${t['the']} ${authenticatedUser.last_name} ${t['household']}`}
        />
        <SetupEncryptionStep
          nextStep={t['nextMembers']}
          onNext={(seed) => {
            onCreateEncryptionKey(seed)
            setActiveStep(4)
          }}
        />
        <SetupMembersStep
          nextStep={t['nextAccounts']}
          onNext={() => setActiveStep(5)}
          authenticatedUser={authenticatedUser}
          userAvatars={userAvatars}
          users={users}
          onDeleteUser={onDeleteUser}
          onSaveUser={onSaveUser}
        />
        <SetupBankAccountsStep
          nextStep={t['nextIntro']}
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
          title={t['ready']}
          nextStep={t['finish']}
          isReady={true}
          onNext={() => setIsOpen(false)}
        >
          <VideoContainer
            src="https://player.vimeo.com/video/827536470"
            title="HANIA RANI — HELLO"
          />
        </Step>
      </Stepper>
    </Box>
  )
}
