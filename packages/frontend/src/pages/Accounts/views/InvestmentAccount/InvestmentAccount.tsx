import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import type { FC } from 'react'

import type { InvestmentAccountProps } from './InvestmentAccount.interface'

/**
 * Main Component: View for Investment Accounts such as 401ks, stock trading etc.
 */

const InvestmentAccount: FC<InvestmentAccountProps> = (_: InvestmentAccountProps) => {
  return (
    <Box padding={2}>
      <Paper>
        <Typography variant="h4">Investment Account</Typography>
        Not currently supported but coming soon!
      </Paper>
    </Box>
  )
}

export default InvestmentAccount
