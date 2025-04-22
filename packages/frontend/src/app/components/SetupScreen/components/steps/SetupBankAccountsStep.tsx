import { Step } from '@/components/Stepper'
import { Button, Grid, Typography } from '@mui/material'
import React from 'react'

import { AccountTableUIContainer } from '@/components/AccountTable'
import { BankAccountDrawer, InstitutionDrawer } from '@/components/drawers'
import type { IAccount, IBook, IInstitution, IInstitutionUpdate, IUser } from '@angelfish/core'

/**
 * Component Properties
 */
export interface SetupBankAccountsStepProps {
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
   * The bank Accounts in database with relations loaded
   */
  accountsWithRelations: IAccount[]
  /**
   * The Book open in the database
   */
  book?: IBook
  /*
   * The Institutions in database
   */
  institutions: IInstitution[]
  /**
   * The Users in the database
   */
  users: IUser[]
  /**
   * Callback function to delete an existing account
   */
  onDeleteAccount: (account: IAccount) => void
  /**
   * Callback function to delete an existing institution
   */
  onDeleteInstitution: (institution: IInstitution) => void
  /**
   * Async Callback to power autocomplete search as user searches
   * remote Institutions from Cloud API
   */
  onSearchInstitutions: (query: string) => Promise<IInstitutionUpdate[]>
  /**
   * Callback function to edit an account
   */
  onSaveAccount: (account: Partial<IAccount>) => void
  /**
   * Callback function to edit an institution
   */
  onSaveInstitution: (institution: IInstitutionUpdate) => void
}

/**
 * Allow User to setup some Institutions and Bank Accounts for their Household before they
 * enter the app so it's not empty when they start.
 */
export default function SetupBankAccountsStep({
  nextStep,
  onNext,
  accountsWithRelations,
  book,
  institutions,
  users,
  onDeleteAccount,
  onDeleteInstitution,
  onSearchInstitutions,
  onSaveAccount,
  onSaveInstitution,
}: SetupBankAccountsStepProps) {
  // Component State
  const [isReady, setIsReady] = React.useState<boolean>(false)
  const [showInstitutionDrawer, setShowInstitutionDrawer] = React.useState<boolean>(false)
  const [showAccountDrawer, setShowAccountDrawer] = React.useState<boolean>(false)

  // Enable Button When Form Is Ready
  React.useEffect(() => {
    setIsReady(true)
  }, [])

  /**
   * Handle form submission to update user and trigger onNext
   * if successful
   */
  const handleSubmit = () => {
    onNext()
  }

  // Render
  return (
    <Step
      title="Setup Your Bank Accounts"
      nextStep={nextStep}
      isReady={isReady}
      onNext={handleSubmit}
    >
      <Grid
        container
        spacing={3}
        alignItems="center"
        justifyContent="flex-start"
        sx={{ width: '100%', marginLeft: 0 }}
      >
        <Grid size={12} sx={{ paddingLeft: '0px !important', paddingBottom: 2 }}>
          <Typography variant="body1">
            Add some Bank Accounts to your Household so you can start tracking your Income and
            Expenses in Angelfish across them. Double Click an Account or Institution to edit it
          </Typography>
        </Grid>
        <Grid
          size={12}
          border={(theme) => `1px solid ${theme.palette.grey[300]}`}
          sx={{ padding: '0px !important', maxHeight: 'calc(100vh - 300px)', overflowY: 'auto' }}
        >
          {book && (
            <AccountTableUIContainer
              accountsWithRelations={accountsWithRelations}
              book_default_currency={book.default_currency}
              disableContextMenu={true}
              institutions={institutions}
              users={users}
              onSaveAccount={onSaveAccount}
              onDeleteAccount={onDeleteAccount}
              onSaveInstitution={onSaveInstitution}
              onDeleteInstitution={onDeleteInstitution}
              onSearchInstitutions={onSearchInstitutions}
              onSelectAccount={(_account) => {
                /* Do nothing */
              }}
            />
          )}
        </Grid>
      </Grid>
      <InstitutionDrawer
        open={showInstitutionDrawer}
        onSearch={onSearchInstitutions}
        onClose={() => setShowInstitutionDrawer(false)}
        onSave={onSaveInstitution}
      />
      <BankAccountDrawer
        open={showAccountDrawer}
        onClose={() => setShowAccountDrawer(false)}
        onSave={(updatedAccount) => onSaveAccount(updatedAccount)}
        institutions={institutions}
        users={users}
      />
      <Grid
        size={12}
        sx={{ paddingLeft: '0px !important', paddingBottom: 2, paddingTop: 2, gap: 2 }}
      >
        <Button
          onClick={() => setShowInstitutionDrawer(true)}
          className="button"
          variant="outlined"
        >
          Add Institution
        </Button>
        <Button onClick={() => setShowAccountDrawer(true)} className="button" variant="outlined">
          Add Account
        </Button>
      </Grid>
    </Step>
  )
}
