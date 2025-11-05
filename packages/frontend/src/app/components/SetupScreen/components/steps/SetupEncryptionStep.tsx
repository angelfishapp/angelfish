import Box from '@mui/material/Box'
import React from 'react'

import { EntropyGenerator } from '@/components/EntropyGenerator'
import { Step } from '@/components/Stepper'

/**
 * Component Properties
 */
export interface SetupEncryptionStepProps {
  /**
   * Next Step title to display in Complete Button at bottom
   * of panel
   */
  nextStep: string
  /**
   * Callback to create encryption keys and move to next step
   */
  onNext: (seed: string) => Promise<void>
}

/**
 * Setup step to generate encryption keys for household
 */
export default function SetupEncryptionStep({ nextStep, onNext }: SetupEncryptionStepProps) {
  // Hold the entropy seed value
  const seedRef = React.useRef<string>('')
  // Is seed entropy high enough and ready to go next step?
  const [isReady, setIsReady] = React.useState<boolean>(false)

  /**
   * Start timer to evaluate seed string entropy (length)
   * is sufficient to move to next step at 4 second intervals
   */
  React.useEffect(() => {
    const intervalId = setInterval(() => {
      if (seedRef.current.length >= 64) {
        setIsReady(true)
      }
    }, 4000)

    return () => clearInterval(intervalId) // Cleanup on unmount
  }, [seedRef])

  return (
    <Step
      title="Setup Encryption Keys"
      nextStep={nextStep}
      isReady={isReady}
      onNext={async () => await onNext(seedRef.current)}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <p>
          Draw a pattern below to generate a completely unique and secure encryption key for your
          household.
          <br />
          <strong>(NOTE This is for demo purposes only - ENCRYPTION ISN&apos;T ADDED YET!)</strong>
        </p>
        <Box
          sx={{
            background: 'linear-gradient(180deg, #47CCAF 0%, #1B97DE 100%)',
            width: '300px',
            height: '300px',
            borderRadius: 3,
          }}
        >
          <EntropyGenerator size={300} onChange={(seed) => (seedRef.current = seed)} />
        </Box>
      </Box>
    </Step>
  )
}
