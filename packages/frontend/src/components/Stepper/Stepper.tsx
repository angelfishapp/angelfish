import React from 'react'

import { useTranslate } from '@/utils/i18n/I18nProvider'
import { ClickAwayListener } from '@mui/material'
import Fade from '@mui/material/Fade'
import { BubbleList } from './components/BubbleList'
import type { StepperProps } from './Stepper.interface'
import { BubbleContainer, StepContainer, StepperContainer } from './Stepper.styles'

/**
 * Stepper component that allows for a list of steps to be shown on screen with numbered bubbles
 * on right side of screen to show which step is active. When a step is completed, the bubble will
 * pop and show a checkmark.
 */

export default function Stepper({
  children,
  activeStep,
  open = true,
  disableBackdropClick = false,
  displayBackdrop = false,
  labels,
  onClose,
  onTransitionEnd,
}: StepperProps) {
  const { direction } = useTranslate()
  const [show, setShow] = React.useState(open)

  React.useEffect(() => {
    if (open) setShow(open)
  }, [open])

  // Render
  return (
    <Fade
      onExited={() => {
        if (!open) setShow(false)
        onTransitionEnd?.()
      }}
      unmountOnExit
      mountOnEnter
      in={open}
      timeout={500}
    >
      <StepperContainer
        className={displayBackdrop ? 'backdrop' : undefined}
        sx={{ padding: direction === 'ltr' ? '24px 0 24px 104px' : '24px 104px 24px 0' }}
      >
        {(show || open) && (
          <div>
            <ClickAwayListener
              onClickAway={() => {
                if (!disableBackdropClick) {
                  onClose?.()
                }
              }}
            >
              <StepContainer>
                {children.map((child, index) => (
                  <li
                    key={index}
                    className="step"
                    style={
                      activeStep == index + 1
                        ? { opacity: 1, transform: 'translateY(0)', position: 'relative' }
                        : activeStep > index + 1
                          ? { opacity: 0, transform: 'translateY(-100%)', pointerEvents: 'none' }
                          : undefined
                    }
                  >
                    {child}
                  </li>
                ))}
              </StepContainer>
            </ClickAwayListener>
            <BubbleContainer>
              <BubbleList
                labels={labels ?? children.map((_) => '')}
                totalSteps={children.length}
                activeStep={activeStep}
              />
            </BubbleContainer>
          </div>
        )}
      </StepperContainer>
    </Fade>
  )
}
