import clsx from 'clsx'
import React from 'react'

import { ClickAwayListener } from '@mui/material'
import Fade from '@mui/material/Fade'
import { BubbleList } from './components/BubbleList'
import type { StepperProps } from './Stepper.interface'
import { useStyles } from './Stepper.styles'

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
  const classes = useStyles()

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
      <div className={clsx(classes.stepperContainer, displayBackdrop ? 'backdrop' : undefined)}>
        {(show || open) && (
          <div>
            <ClickAwayListener
              onClickAway={() => {
                if (!disableBackdropClick) {
                  onClose?.()
                }
              }}
            >
              <ol className={classes.stepContainer}>
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
              </ol>
            </ClickAwayListener>
            <BubbleList
              labels={labels ?? children.map((_) => '')}
              totalSteps={children.length}
              activeStep={activeStep}
              className={classes.bubbleContainer}
            />
          </div>
        )}
      </div>
    </Fade>
  )
}
