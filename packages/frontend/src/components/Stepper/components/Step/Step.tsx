import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import type { StepProps } from './Step.interface'
import { StepPanelContainer } from './Step.styles'

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
  // Render
  return (
    <StepPanelContainer>
      <Typography variant="h5" className="header" noWrap>
        {title}
      </Typography>
      {children}
      <Box display="flex" alignContent="center" justifyContent="center" marginTop="20px">
        {onCancel && (
          <Button variant="outlined" onClick={() => onCancel?.()} className="cancelButton">
            Cancel
          </Button>
        )}
        <Button disabled={!isReady} onClick={() => onNext()} className="button">
          {nextStep}
        </Button>
      </Box>
    </StepPanelContainer>
  )
}
