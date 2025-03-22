import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import type { FC } from 'react'

import type { OtherAccountProps } from './OtherAccount.interface'

/**
 * Main Component: View for Loan Other types (TBD)
 */

const OtherAccount: FC<OtherAccountProps> = (_: OtherAccountProps) => {
  return (
    <Box padding={2}>
      <Paper>
        <Typography variant="h4">Other Account</Typography>
        Not currently supported but coming soon!
      </Paper>
    </Box>
  )
}

export default OtherAccount
