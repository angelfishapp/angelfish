import type React from 'react'

import type { BubbleListProps } from './BubbleList.interface'
import { BubbleListContainer } from './BubbleList.styles'
import BubbleStep from './BubbleStep'

/**
 * Main Component - Displays list of animated step bubbles to indicate
 * progress on setup process
 */

export default function BubbleList({ totalSteps, activeStep, className, labels }: BubbleListProps) {
  // Make sure component properties are valid
  if (totalSteps < 0) totalSteps = 0
  if (activeStep < 0) activeStep = 0
  if (activeStep > totalSteps) activeStep = totalSteps

  // Generate list of bubbles
  const bubbles: React.JSX.Element[] = []
  const initialTransitionDelay = 1
  for (let i = 1; i <= totalSteps; i++) {
    const isComplete = i < activeStep
    const isActive = i == activeStep
    const transitionDelay = initialTransitionDelay + (i - 1) * 0.2
    bubbles.push(
      <BubbleStep
        key={i}
        label={labels[i - 1]}
        stepNumber={i}
        isActive={isActive}
        isComplete={isComplete}
        showDelay={transitionDelay}
      />,
    )
  }

  // Render
  return <BubbleListContainer className={className}>{bubbles}</BubbleListContainer>
}
