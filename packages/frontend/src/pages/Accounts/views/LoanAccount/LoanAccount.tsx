import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import type { FC } from 'react'

import type { LoanAccountProps } from './LoanAccount.interface'

/**
 * Main Component: View for Loan Account types such as Mortgages & Student Loans
 */

const LoanAccountView: FC<LoanAccountProps> = (_: LoanAccountProps) => {
  return (
    <Box padding={2}>
      <Paper>
        <Typography variant="h4">Loan Account</Typography>
        Not currently supported but coming soon!
      </Paper>
    </Box>
  )
}

export default LoanAccountView
