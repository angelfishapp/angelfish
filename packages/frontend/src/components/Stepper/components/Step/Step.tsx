import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

import type { StepProps } from './Step.interface'
import { useStyles } from './Step.styles'

/**
 * Displays a Step Panel with form for user to complete
 * before moving onto the next step of the Setup workflow
 */

export default function StepPanel({
  title,
  nextStep,
  children,
  isReady = false,
  onCancel,
  onNext,
}: StepProps) {
  const classes = useStyles()

  // Render
  return (
    <Paper className={classes.stepPanel}>
      <Typography variant="h5" className={classes.header} noWrap>
        {title}
      </Typography>
      {children}
      <Box display="flex" alignContent="center" justifyContent="center" marginTop="20px">
        {onCancel && (
          <Button variant="outlined" onClick={() => onCancel?.()} className={classes.cancelButton}>
            Cancel
          </Button>
        )}
        <Button disabled={!isReady} onClick={() => onNext()} className={classes.button}>
          {nextStep}
        </Button>
      </Box>
    </Paper>
  )
}
