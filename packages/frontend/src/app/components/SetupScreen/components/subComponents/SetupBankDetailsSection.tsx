import { BankAccountDrawer, InstitutionDrawer } from '@/components/drawers'
import type { IAccount, IInstitution, IInstitutionUpdate } from '@angelfish/core'
import type { IUser } from '@angelfish/core/src/types'
import { Button, Grid } from '@mui/material'
import React from 'react'

/**
 * Component Properties
 */
export interface SetupBankDetailsSectionProps {
  /*
   * The Institutions in database
   */
  institutions: IInstitution[]
  /**
   * The Users in the database
   */
  users: IUser[]

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

export default function SetupBankDetailsSection({
  onSearchInstitutions,
  onSaveInstitution,
  onSaveAccount,
  institutions,
  users,
}: SetupBankDetailsSectionProps) {
  const [showInstitutionDrawer, setShowInstitutionDrawer] = React.useState<boolean>(false)
  const [showAccountDrawer, setShowAccountDrawer] = React.useState<boolean>(false)

  return (
    <Grid
      size={12}
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        paddingLeft: '0px !important',
        gap: 4,
        paddingBottom: 1,
        paddingTop: 1,
      }}
    >
      <Button onClick={() => setShowInstitutionDrawer(true)} className="button">
        Add Institution
      </Button>
      <Button onClick={() => setShowAccountDrawer(true)} className="button">
        Add Account
      </Button>
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
    </Grid>
  )
}
