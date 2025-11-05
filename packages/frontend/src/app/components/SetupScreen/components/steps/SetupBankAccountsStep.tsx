import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import React from 'react'

import type { AccountTableMethods } from '@/components/AccountTable'
import { AccountTableUIContainer } from '@/components/AccountTable'
import { Step } from '@/components/Stepper'
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
  onNext: () => Promise<void>
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
  const accountTableMethodsRef = React.useRef<AccountTableMethods>(null)

  // Enable Button When Form Is Ready
  React.useEffect(() => {
    setIsReady(true)
  }, [])

  /**
   * Handle form submission to update user and trigger onNext
   * if successful
   */
  const handleSubmit = async () => {
    await onNext()
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
          sx={{
            padding: '0px !important',
            maxHeight: 'calc(100vh - 300px)',
            overflowY: 'auto',
            height: 350,
          }}
        >
          {book && (
            <AccountTableUIContainer
              ref={accountTableMethodsRef}
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
      <Grid
        size={12}
        container
        spacing={3}
        sx={{
          paddingLeft: '0px !important',
          paddingBottom: 1,
          paddingTop: 1,
        }}
      >
        <Grid size={6}>
          <Button
            onClick={() => accountTableMethodsRef.current?.addInstitution()}
            fullWidth
            variant="outlined"
          >
            Add Institution
          </Button>
        </Grid>
        <Grid size={6}>
          <Button
            onClick={() => accountTableMethodsRef.current?.addBankAccount()}
            disabled={!institutions || institutions.length === 0}
            fullWidth
            variant="outlined"
          >
            Add Account
          </Button>
        </Grid>
      </Grid>
    </Step>
  )
}
